import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SchedulingService, TeamHubService } from 'api';
import type { TeamMember } from '../../data/mock-data';

type StatusFilter = 'all' | 'online' | 'away';

@Component({
  selector: 'app-team-members',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './team-members.html',
  styleUrl: './team-members.scss',
})
export class TeamMembersPage implements OnDestroy {
  private readonly schedulingService = inject(SchedulingService);
  private readonly teamHub = inject(TeamHubService);
  private readonly router = inject(Router);
  private currentEmployeeId = '';
  private presenceSub: Subscription;

  readonly members = signal<TeamMember[]>([]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly hasMore = signal(false);
  readonly isLoadingMore = signal(false);
  private readonly pageSize = 100;
  private loadedCount = 0;

  readonly onlineCount = computed(() => this.members().filter((m) => m.status === 'online').length);
  readonly awayCount = computed(() => this.members().filter((m) => m.status === 'away').length);

  readonly filteredMembers = computed(() => {
    let result = this.members();
    const filter = this.statusFilter();
    if (filter !== 'all') {
      result = result.filter((m) => m.status === filter);
    }
    return result;
  });

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.schedulingService.getCurrentEmployee().subscribe((emp) => {
      this.currentEmployeeId = emp.id;
    });
    this.loadMembers();

    this.presenceSub = this.teamHub.presence$.subscribe((update) => {
      const status = update.presence.toLowerCase() as 'online' | 'away' | 'offline';
      this.members.update((members) =>
        members.map((m) => (m.employeeId === update.employeeId ? { ...m, status } : m))
      );
    });
  }

  ngOnDestroy(): void {
    this.presenceSub.unsubscribe();
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);

    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadMembers();
    }, 300);
  }

  onFilterChange(value: StatusFilter) {
    this.statusFilter.set(value);
  }

  loadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    const search = this.searchQuery() || undefined;
    this.schedulingService.getEmployees(undefined, search, this.loadedCount, this.pageSize).subscribe({
      next: (employees) => {
        const mapped = employees.map((e, i) => ({
          id: this.loadedCount + i + 1,
          name: `${e.firstName} ${e.lastName}`,
          initials: `${e.firstName[0]}${e.lastName[0]}`.toUpperCase(),
          role: e.jobTitle,
          department: e.department ?? '',
          avatar: '',
          status: (e.presence?.toLowerCase() ?? 'offline') as 'online' | 'away' | 'offline',
          email: e.email,
          employeeId: e.id,
        }));
        this.loadedCount += employees.length;
        this.hasMore.set(employees.length >= this.pageSize);
        this.members.update((prev) => [...prev, ...mapped]);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }

  private loadMembers(): void {
    const search = this.searchQuery() || undefined;
    this.schedulingService.getEmployees(undefined, search, 0, this.pageSize).subscribe((employees) => {
      this.loadedCount = employees.length;
      this.hasMore.set(employees.length >= this.pageSize);
      this.members.set(
        employees.map((e, i) => ({
          id: i + 1,
          name: `${e.firstName} ${e.lastName}`,
          initials: `${e.firstName[0]}${e.lastName[0]}`.toUpperCase(),
          role: e.jobTitle,
          department: e.department ?? '',
          avatar: '',
          status: (e.presence?.toLowerCase() ?? 'offline') as 'online' | 'away' | 'offline',
          email: e.email,
          employeeId: e.id,
        }))
      );
    });
  }

  startVideoCall(member: TeamMember): void {
    if (!member.employeeId || !this.currentEmployeeId) return;

    const roomName = `call-${this.currentEmployeeId.replace(/-/g, '').substring(0, 8)}-${member.employeeId.replace(/-/g, '').substring(0, 8)}`;
    this.schedulingService.getCurrentEmployee().subscribe((me) => {
      const userName = `${me.firstName} ${me.lastName}`;
      this.schedulingService.joinCall({ roomName, userName, isOwner: true }).subscribe({
        next: (callToken) => {
          window.open(`${callToken.roomUrl}?t=${callToken.token}`, '_blank', 'width=1024,height=768,menubar=no,toolbar=no');
        },
      });
    });
  }

  startChat(member: TeamMember): void {
    if (!member.employeeId || !this.currentEmployeeId) return;

    // Check if DM channel already exists by loading channels
    this.schedulingService.getChannels(this.currentEmployeeId).subscribe((channels) => {
      const existingDm = channels.find(
        (c) => c.channelType === 'DirectMessage' && c.name === member.name
      );

      if (existingDm) {
        this.router.navigate(['/chat'], { queryParams: { channel: existingDm.id } });
      } else {
        this.schedulingService
          .createChannel({
            name: member.name,
            channelType: 'DirectMessage',
            createdByEmployeeId: this.currentEmployeeId,
            participantEmployeeIds: [this.currentEmployeeId, member.employeeId!],
          })
          .subscribe((newChannel) => {
            this.router.navigate(['/chat'], { queryParams: { channel: newChannel.id } });
          });
      }
    });
  }
}
