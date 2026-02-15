import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from '../api.config';

export interface HubMessage {
  channelId: string;
  senderEmployeeId: string;
  senderName: string;
  senderInitials: string;
  content: string;
  sentAt: string;
}

export interface HubPresenceUpdate {
  employeeId: string;
  presence: string;
}

export interface HubTypingUpdate {
  channelId: string;
  employeeId: string;
  employeeName: string;
  isTyping: boolean;
}

@Injectable({ providedIn: 'root' })
export class TeamHubService implements OnDestroy {
  private readonly baseUrl = inject(API_CONFIG).baseUrl;
  private connection: signalR.HubConnection | null = null;

  private readonly _messages$ = new Subject<HubMessage>();
  private readonly _presence$ = new Subject<HubPresenceUpdate>();
  private readonly _typing$ = new Subject<HubTypingUpdate>();

  readonly messages$ = this._messages$.asObservable();
  readonly presence$ = this._presence$.asObservable();
  readonly typing$ = this._typing$.asObservable();

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/team`, {
        accessTokenFactory: () => localStorage.getItem('auth_token') ?? '',
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveMessage', (msg: HubMessage) => {
      this._messages$.next(msg);
    });

    this.connection.on('PresenceUpdated', (update: HubPresenceUpdate) => {
      this._presence$.next(update);
    });

    this.connection.on('UserTyping', (update: HubTypingUpdate) => {
      this._typing$.next(update);
    });

    await this.connection.start();
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  async joinChannel(channelId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('JoinChannel', channelId);
    }
  }

  async leaveChannel(channelId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('LeaveChannel', channelId);
    }
  }

  async sendMessage(channelId: string, senderEmployeeId: string, senderName: string, senderInitials: string, content: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('SendMessage', channelId, senderEmployeeId, senderName, senderInitials, content);
    }
  }

  async startTyping(channelId: string, employeeId: string, employeeName: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('StartTyping', channelId, employeeId, employeeName);
    }
  }

  async stopTyping(channelId: string, employeeId: string, employeeName: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('StopTyping', channelId, employeeId, employeeName);
    }
  }

  async updatePresence(employeeId: string, presence: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('UpdatePresence', employeeId, presence);
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
