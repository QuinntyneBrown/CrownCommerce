import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Meeting,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  CalendarEvent,
  ConversationSummary,
  ScheduleConversation,
  CreateConversationRequest,
  SendMessageRequest,
  ConversationMessage,
  Channel,
  ChannelMessage,
  SendChannelMessageRequest,
  UpdateChannelMessageRequest,
  CreateChannelRequest,
  MarkAsReadRequest,
  ActivityFeedItem,
  UpdatePresenceRequest,
  FileAttachment,
  CallRoom,
  CallToken,
  JoinCallRequest,
} from '../models/scheduling.models';

@Injectable({ providedIn: 'root' })
export class SchedulingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/api/scheduling`;

  // Employees
  getEmployees(status?: string, search?: string, skip = 0, take = 100): Observable<Employee[]> {
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`, { params });
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }

  getCurrentEmployee(): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/me`);
  }

  createEmployee(request: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, request);
  }

  updateEmployee(id: string, request: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${id}`, request);
  }

  // Meetings
  getMeeting(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.baseUrl}/meetings/${id}`);
  }

  getCalendarEvents(startUtc: string, endUtc: string, employeeId?: string, skip = 0, take = 50): Observable<CalendarEvent[]> {
    let params = new HttpParams()
      .set('startUtc', startUtc)
      .set('endUtc', endUtc)
      .set('skip', skip)
      .set('take', take);
    if (employeeId) params = params.set('employeeId', employeeId);
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}/meetings/calendar`, { params });
  }

  getUpcomingMeetings(count = 10): Observable<Meeting[]> {
    const params = new HttpParams().set('count', count);
    return this.http.get<Meeting[]>(`${this.baseUrl}/meetings/upcoming`, { params });
  }

  createMeeting(request: CreateMeetingRequest): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.baseUrl}/meetings`, request);
  }

  updateMeeting(id: string, request: UpdateMeetingRequest): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/meetings/${id}`, request);
  }

  respondToMeeting(meetingId: string, employeeId: string, response: string): Observable<Meeting> {
    return this.http.post<Meeting>(
      `${this.baseUrl}/meetings/${meetingId}/respond/${employeeId}`,
      { response }
    );
  }

  cancelMeeting(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/meetings/${id}/cancel`, null);
  }

  exportMeetingToICal(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/meetings/${id}/ical`, { responseType: 'blob' });
  }

  // Conversations
  getConversations(employeeId?: string): Observable<ConversationSummary[]> {
    let params = new HttpParams();
    if (employeeId) params = params.set('employeeId', employeeId);
    return this.http.get<ConversationSummary[]>(`${this.baseUrl}/conversations`, { params });
  }

  getConversation(id: string): Observable<ScheduleConversation> {
    return this.http.get<ScheduleConversation>(`${this.baseUrl}/conversations/${id}`);
  }

  createConversation(request: CreateConversationRequest): Observable<ScheduleConversation> {
    return this.http.post<ScheduleConversation>(`${this.baseUrl}/conversations`, request);
  }

  sendMessage(conversationId: string, request: SendMessageRequest): Observable<ConversationMessage> {
    return this.http.post<ConversationMessage>(
      `${this.baseUrl}/conversations/${conversationId}/messages`,
      request
    );
  }

  // Channels
  getChannels(employeeId: string): Observable<Channel[]> {
    const params = new HttpParams().set('employeeId', employeeId);
    return this.http.get<Channel[]>(`${this.baseUrl}/channels`, { params });
  }

  getChannelMessages(channelId: string, skip = 0, take = 50): Observable<ChannelMessage[]> {
    const params = new HttpParams().set('skip', skip).set('take', take);
    return this.http.get<ChannelMessage[]>(`${this.baseUrl}/channels/${channelId}/messages`, { params });
  }

  searchChannelMessages(channelId: string, query: string): Observable<ChannelMessage[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ChannelMessage[]>(`${this.baseUrl}/channels/${channelId}/messages/search`, { params });
  }

  sendChannelMessage(channelId: string, request: SendChannelMessageRequest): Observable<ChannelMessage> {
    return this.http.post<ChannelMessage>(`${this.baseUrl}/channels/${channelId}/messages`, request);
  }

  updateChannelMessage(channelId: string, messageId: string, request: UpdateChannelMessageRequest): Observable<ChannelMessage> {
    return this.http.put<ChannelMessage>(`${this.baseUrl}/channels/${channelId}/messages/${messageId}`, request);
  }

  deleteChannelMessage(channelId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/channels/${channelId}/messages/${messageId}`);
  }

  markChannelAsRead(channelId: string, request: MarkAsReadRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/channels/${channelId}/read`, request);
  }

  addReaction(channelId: string, messageId: string, request: { employeeId: string; emoji: string }): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/channels/${channelId}/messages/${messageId}/reactions`, request);
  }

  removeReaction(channelId: string, messageId: string, employeeId: string, emoji: string): Observable<void> {
    const params = new HttpParams().set('employeeId', employeeId).set('emoji', emoji);
    return this.http.delete<void>(`${this.baseUrl}/channels/${channelId}/messages/${messageId}/reactions`, { params });
  }

  createChannel(request: CreateChannelRequest): Observable<Channel> {
    return this.http.post<Channel>(`${this.baseUrl}/channels`, request);
  }

  // Activity Feed
  getActivityFeed(employeeId: string, count = 10, skip = 0): Observable<ActivityFeedItem[]> {
    const params = new HttpParams().set('employeeId', employeeId).set('count', count).set('skip', skip);
    return this.http.get<ActivityFeedItem[]>(`${this.baseUrl}/activity`, { params });
  }

  // Files
  uploadFile(file: File, employeeId: string): Observable<FileAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', employeeId);
    return this.http.post<FileAttachment>(`${this.baseUrl}/files`, formData);
  }

  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/files/${id}`);
  }

  // Calls
  createCallRoom(name: string): Observable<CallRoom> {
    return this.http.post<CallRoom>(`${this.baseUrl}/calls/rooms`, { name });
  }

  getCallRoom(name: string): Observable<CallRoom> {
    return this.http.get<CallRoom>(`${this.baseUrl}/calls/rooms/${name}`);
  }

  joinCall(request: JoinCallRequest): Observable<CallToken> {
    return this.http.post<CallToken>(`${this.baseUrl}/calls/join`, request);
  }

  // Presence
  updatePresence(employeeId: string, request: UpdatePresenceRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${employeeId}/presence`, request);
  }
}
