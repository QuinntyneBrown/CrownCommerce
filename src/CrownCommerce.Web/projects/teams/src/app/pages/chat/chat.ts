import { Component, computed, DestroyRef, effect, inject, OnDestroy, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingService, TeamHubService } from 'api';
import type { FileAttachment } from 'api';
import type { ChatChannel, ChatMessage } from '../../data/mock-data';
import { NewChannelDialog } from './new-channel-dialog';
import { MentionHighlightPipe } from './mention-highlight.pipe';

@Component({
  selector: 'app-chat',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MentionHighlightPipe,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatPage implements OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly schedulingService = inject(SchedulingService);
  private readonly teamHub = inject(TeamHubService);
  private readonly dialog = inject(MatDialog);

  private currentEmployeeId = '';
  private currentEmployeeName = '';
  private hubSub: Subscription | null = null;
  private typingSub: Subscription | null = null;
  private guidToNumId = new Map<string, number>();
  private previousChannelGuid: string | null = null;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private isTyping = false;

  private readonly isMobileSignal = toSignal(
    this.breakpointObserver.observe('(max-width: 767px)').pipe(
      map((result) => result.matches)
    ),
    { initialValue: false }
  );

  readonly isMobile = computed(() => this.isMobileSignal());
  readonly showChannelList = signal(true);
  readonly selectedChannelId = signal<number>(0);

  readonly channels = signal<ChatChannel[]>([]);
  readonly searchQuery = signal('');
  readonly isSearchingMessages = signal(false);

  readonly publicChannels = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const chs = this.channels().filter((c) => !c.isPrivate);
    return q ? chs.filter((c) => c.name.toLowerCase().includes(q)) : chs;
  });
  readonly directMessages = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const dms = this.channels().filter((c) => c.isPrivate);
    return q ? dms.filter((c) => c.name.toLowerCase().includes(q)) : dms;
  });

  readonly messages = signal<ChatMessage[]>([]);
  readonly searchResults = signal<ChatMessage[]>([]);
  readonly messageText = signal('');
  readonly editingMessageId = signal<number | null>(null);
  readonly editText = signal('');
  readonly typingUsers = signal<string[]>([]);
  readonly hasMoreMessages = signal(false);
  readonly isLoadingMore = signal(false);
  private readonly pageSize = 50;
  private loadedMessageCount = 0;

  readonly pendingAttachments = signal<FileAttachment[]>([]);
  readonly isUploading = signal(false);

  readonly mentionQuery = signal('');
  readonly showMentionDropdown = signal(false);
  private allEmployeeNames: string[] = [];
  private mentionStartPos = -1;

  readonly mentionSuggestions = computed(() => {
    const q = this.mentionQuery().toLowerCase();
    if (!q) return this.allEmployeeNames.slice(0, 5);
    return this.allEmployeeNames.filter((name) => name.toLowerCase().includes(q)).slice(0, 5);
  });

  readonly selectedChannel = computed(() =>
    this.channels().find((c) => c.id === this.selectedChannelId())
  );

  private channelIdMap = new Map<number, string>(); // numeric id -> guid

  constructor() {
    // Load the authenticated employee, then load channels and connect hub
    this.schedulingService.getCurrentEmployee().subscribe((employee) => {
      this.currentEmployeeId = employee.id;
      this.currentEmployeeName = `${employee.firstName} ${employee.lastName}`;
      this.schedulingService.getEmployees().subscribe((emps) => {
        this.allEmployeeNames = emps.map((e) => `${e.firstName} ${e.lastName}`);
      });
      this.loadChannels();
      this.teamHub.connect();
      this.hubSub = this.teamHub.messages$.subscribe((msg) => {
        const numId = this.guidToNumId.get(msg.channelId);
        if (!numId) return;

        if (numId === this.selectedChannelId()) {
          this.messages.update((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              channelId: numId,
              senderId: 0,
              senderName: msg.senderName,
              senderInitials: msg.senderInitials,
              content: msg.content,
              timestamp: new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              isOwn: msg.senderEmployeeId === this.currentEmployeeId,
            },
          ]);
        } else {
          this.channels.update((chs) =>
            chs.map((c) => (c.id === numId ? { ...c, unreadCount: c.unreadCount + 1 } : c))
          );
        }
      });

      this.typingSub = this.teamHub.typing$.subscribe((update) => {
        const numId = this.guidToNumId.get(update.channelId);
        if (numId !== this.selectedChannelId()) return;

        if (update.isTyping) {
          this.typingUsers.update((users) =>
            users.includes(update.employeeName) ? users : [...users, update.employeeName]
          );
        } else {
          this.typingUsers.update((users) => users.filter((u) => u !== update.employeeName));
        }
      });
    });

    // When selected channel changes, load messages and join SignalR group
    effect(() => {
      const numId = this.selectedChannelId();
      const guid = this.channelIdMap.get(numId);

      // Leave previous channel group and clear typing state
      this.typingUsers.set([]);
      if (this.previousChannelGuid) {
        this.teamHub.leaveChannel(this.previousChannelGuid);
      }

      if (guid) {
        this.previousChannelGuid = guid;
        this.teamHub.joinChannel(guid);

        this.schedulingService.getChannelMessages(guid, 0, this.pageSize).subscribe((msgs) => {
          this.loadedMessageCount = msgs.length;
          this.hasMoreMessages.set(msgs.length >= this.pageSize);
          this.messages.set(
            msgs.map((m, i) => ({
              id: i + 1,
              channelId: numId,
              senderId: 0,
              senderName: m.senderName,
              senderInitials: m.senderInitials,
              content: m.content,
              timestamp: new Date(m.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              isOwn: m.senderEmployeeId === this.currentEmployeeId,
              apiId: m.id,
              reactions: m.reactions ?? [],
              attachments: m.attachments?.map(a => ({ id: a.id, fileName: a.fileName, contentType: a.contentType, sizeBytes: a.sizeBytes, url: a.url })) ?? [],
            }))
          );
        });

        // Mark as read
        this.schedulingService.markChannelAsRead(guid, { employeeId: this.currentEmployeeId }).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.hubSub?.unsubscribe();
    this.typingSub?.unsubscribe();
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    if (this.previousChannelGuid) {
      this.teamHub.leaveChannel(this.previousChannelGuid);
    }
  }

  private loadChannels() {
    this.schedulingService.getChannels(this.currentEmployeeId).subscribe((apiChannels) => {
      const mapped: ChatChannel[] = apiChannels.map((c, i) => {
        const numId = i + 1;
        this.channelIdMap.set(numId, c.id);
        this.guidToNumId.set(c.id, numId);
        return {
          id: numId,
          name: c.name,
          icon: c.icon ?? 'tag',
          unreadCount: c.unreadCount,
          lastMessage: c.lastMessage ?? '',
          lastMessageTime: c.lastMessageTime ? this.formatRelativeTime(c.lastMessageTime) : '',
          isPrivate: c.channelType === 'DirectMessage',
        };
      });

      this.channels.set(mapped);

      if (mapped.length > 0 && this.selectedChannelId() === 0) {
        this.selectedChannelId.set(mapped[0].id);
      }
    });
  }

  selectChannel(id: number) {
    this.selectedChannelId.set(id);
    if (this.isMobile()) {
      this.showChannelList.set(false);
    }
  }

  backToChannels() {
    this.showChannelList.set(true);
  }

  onMessageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.messageText.set(value);

    // Detect @ mention
    const cursorPos = input.selectionStart ?? value.length;
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    if (atIndex >= 0 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      if (!query.includes(' ') || query.length < 30) {
        this.mentionStartPos = atIndex;
        this.mentionQuery.set(query);
        this.showMentionDropdown.set(true);
      } else {
        this.showMentionDropdown.set(false);
      }
    } else {
      this.showMentionDropdown.set(false);
    }

    const guid = this.channelIdMap.get(this.selectedChannelId());
    if (!guid) return;

    if (!this.isTyping && value.trim()) {
      this.isTyping = true;
      this.teamHub.startTyping(guid, this.currentEmployeeId, this.currentEmployeeName);
    }

    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      if (this.isTyping) {
        this.isTyping = false;
        this.teamHub.stopTyping(guid, this.currentEmployeeId, this.currentEmployeeName);
      }
    }, 2000);
  }

  selectMention(name: string): void {
    const text = this.messageText();
    const before = text.substring(0, this.mentionStartPos);
    const after = text.substring(this.mentionStartPos + 1 + this.mentionQuery().length);
    this.messageText.set(`${before}@${name} ${after}`);
    this.showMentionDropdown.set(false);
    this.mentionQuery.set('');
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    const pending = this.pendingAttachments();
    if (!text && pending.length === 0) return;

    const numId = this.selectedChannelId();
    const guid = this.channelIdMap.get(numId);
    if (!guid) return;

    const request: { senderEmployeeId: string; content: string; attachmentIds?: string[] } = {
      senderEmployeeId: this.currentEmployeeId,
      content: text || (pending.length > 0 ? `Shared ${pending.length} file${pending.length > 1 ? 's' : ''}` : ''),
    };
    if (pending.length > 0) {
      request.attachmentIds = pending.map(a => a.id);
    }

    this.schedulingService
      .sendChannelMessage(guid, request)
      .subscribe({
        next: (msg) => {
          this.messages.update((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              channelId: numId,
              senderId: 0,
              senderName: msg.senderName,
              senderInitials: msg.senderInitials,
              content: msg.content,
              timestamp: new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              isOwn: true,
              apiId: msg.id,
              attachments: msg.attachments?.map(a => ({ id: a.id, fileName: a.fileName, contentType: a.contentType, sizeBytes: a.sizeBytes, url: a.url })) ?? [],
            },
          ]);
          this.messageText.set('');
          this.pendingAttachments.set([]);
          if (this.isTyping) {
            this.isTyping = false;
            if (this.typingTimeout) clearTimeout(this.typingTimeout);
            this.teamHub.stopTyping(guid, this.currentEmployeeId, this.currentEmployeeName);
          }
        },
      });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);

    if (query.trim().length >= 2) {
      const guid = this.channelIdMap.get(this.selectedChannelId());
      if (guid) {
        this.isSearchingMessages.set(true);
        this.schedulingService.searchChannelMessages(guid, query).subscribe({
          next: (msgs) => {
            this.searchResults.set(
              msgs.map((m, i) => ({
                id: i + 1,
                channelId: this.selectedChannelId(),
                senderId: 0,
                senderName: m.senderName,
                senderInitials: m.senderInitials,
                content: m.content,
                timestamp: new Date(m.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                isOwn: m.senderEmployeeId === this.currentEmployeeId,
              }))
            );
            this.isSearchingMessages.set(false);
          },
          error: () => this.isSearchingMessages.set(false),
        });
      }
    } else {
      this.searchResults.set([]);
      this.isSearchingMessages.set(false);
    }
  }

  readonly quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  toggleReaction(msg: ChatMessage, emoji: string): void {
    if (!msg.apiId) return;
    const guid = this.channelIdMap.get(this.selectedChannelId());
    if (!guid) return;

    const existing = msg.reactions?.find((r) => r.emoji === emoji);
    if (existing?.hasReacted) {
      this.schedulingService.removeReaction(guid, msg.apiId, this.currentEmployeeId, emoji).subscribe({
        next: () => {
          this.messages.update((msgs) =>
            msgs.map((m) => {
              if (m.id !== msg.id) return m;
              const reactions = (m.reactions ?? [])
                .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, hasReacted: false } : r))
                .filter((r) => r.count > 0);
              return { ...m, reactions };
            })
          );
        },
      });
    } else {
      this.schedulingService.addReaction(guid, msg.apiId, { employeeId: this.currentEmployeeId, emoji }).subscribe({
        next: () => {
          this.messages.update((msgs) =>
            msgs.map((m) => {
              if (m.id !== msg.id) return m;
              const reactions = [...(m.reactions ?? [])];
              const idx = reactions.findIndex((r) => r.emoji === emoji);
              if (idx >= 0) {
                reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1, hasReacted: true };
              } else {
                reactions.push({ emoji, count: 1, hasReacted: true });
              }
              return { ...m, reactions };
            })
          );
        },
      });
    }
  }

  startEdit(msg: ChatMessage): void {
    this.editingMessageId.set(msg.id);
    this.editText.set(msg.content);
  }

  cancelEdit(): void {
    this.editingMessageId.set(null);
    this.editText.set('');
  }

  saveEdit(msg: ChatMessage): void {
    const text = this.editText().trim();
    if (!text || !msg.apiId) return;

    const guid = this.channelIdMap.get(this.selectedChannelId());
    if (!guid) return;

    this.schedulingService.updateChannelMessage(guid, msg.apiId, { content: text }).subscribe({
      next: (updated) => {
        this.messages.update((msgs) =>
          msgs.map((m) => (m.id === msg.id ? { ...m, content: updated.content } : m))
        );
        this.editingMessageId.set(null);
        this.editText.set('');
      },
    });
  }

  deleteMessage(msg: ChatMessage): void {
    if (!msg.apiId) return;

    const guid = this.channelIdMap.get(this.selectedChannelId());
    if (!guid) return;

    this.schedulingService.deleteChannelMessage(guid, msg.apiId).subscribe({
      next: () => {
        this.messages.update((msgs) => msgs.filter((m) => m.id !== msg.id));
      },
    });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearchingMessages.set(false);
  }

  loadMoreMessages(): void {
    const guid = this.channelIdMap.get(this.selectedChannelId());
    if (!guid || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);
    this.schedulingService.getChannelMessages(guid, this.loadedMessageCount, this.pageSize).subscribe({
      next: (msgs) => {
        const numId = this.selectedChannelId();
        const older: ChatMessage[] = msgs.map((m, i) => ({
          id: -(this.loadedMessageCount + i + 1),
          channelId: numId,
          senderId: 0,
          senderName: m.senderName,
          senderInitials: m.senderInitials,
          content: m.content,
          timestamp: new Date(m.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          isOwn: m.senderEmployeeId === this.currentEmployeeId,
          apiId: m.id,
          reactions: m.reactions ?? [],
          attachments: m.attachments?.map(a => ({ id: a.id, fileName: a.fileName, contentType: a.contentType, sizeBytes: a.sizeBytes, url: a.url })) ?? [],
        }));
        this.loadedMessageCount += msgs.length;
        this.hasMoreMessages.set(msgs.length >= this.pageSize);
        this.messages.update((prev) => [...older, ...prev]);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }

  triggerFileInput(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip';
    input.onchange = () => {
      if (input.files) {
        this.uploadFiles(Array.from(input.files));
      }
    };
    input.click();
  }

  private uploadFiles(files: File[]): void {
    if (files.length === 0) return;
    this.isUploading.set(true);
    let completed = 0;

    for (const file of files) {
      this.schedulingService.uploadFile(file, this.currentEmployeeId).subscribe({
        next: (attachment) => {
          this.pendingAttachments.update(prev => [...prev, attachment]);
          completed++;
          if (completed === files.length) {
            this.isUploading.set(false);
          }
        },
        error: () => {
          completed++;
          if (completed === files.length) {
            this.isUploading.set(false);
          }
        },
      });
    }
  }

  removePendingAttachment(id: string): void {
    this.pendingAttachments.update(prev => prev.filter(a => a.id !== id));
    this.schedulingService.deleteFile(id).subscribe();
  }

  isImageFile(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  startVideoCall(): void {
    this.initiateCall(true);
  }

  startAudioCall(): void {
    this.initiateCall(false);
  }

  private initiateCall(video: boolean): void {
    const channel = this.selectedChannel();
    if (!channel) return;

    const guid = this.channelIdMap.get(channel.id);
    if (!guid) return;

    const roomName = `channel-${guid.replace(/-/g, '').substring(0, 16)}`;
    this.schedulingService.joinCall({
      roomName,
      userName: this.currentEmployeeName,
      isOwner: true,
    }).subscribe({
      next: (callToken) => {
        const url = `${callToken.roomUrl}?t=${callToken.token}${video ? '' : '&cam=off'}`;
        window.open(url, '_blank', 'width=1024,height=768,menubar=no,toolbar=no');
      },
    });
  }

  openNewChannelDialog(): void {
    const dialogRef = this.dialog.open(NewChannelDialog, { width: '480px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadChannels();
      }
    });
  }

  private formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
