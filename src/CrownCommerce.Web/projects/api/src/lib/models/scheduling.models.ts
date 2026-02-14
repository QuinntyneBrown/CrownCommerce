export type EmployeeStatus = 'Active' | 'Inactive' | 'OnLeave';
export type MeetingStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
export type AttendeeResponse = 'Pending' | 'Accepted' | 'Declined' | 'Tentative';
export type ConversationStatus = 'Active' | 'Archived' | 'Closed';

export interface Employee {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string;
  department: string | null;
  timeZone: string;
  status: EmployeeStatus;
  createdAt: string;
}

export interface CreateEmployeeRequest {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  jobTitle: string;
  department?: string;
  timeZone: string;
}

export interface UpdateEmployeeRequest {
  phone?: string;
  jobTitle?: string;
  department?: string;
  timeZone?: string;
  status?: EmployeeStatus;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  startTimeUtc: string;
  endTimeUtc: string;
  location: string | null;
  status: MeetingStatus;
  organizerId: string;
  createdAt: string;
  attendees: MeetingAttendee[];
}

export interface MeetingAttendee {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  response: AttendeeResponse;
  respondedAt: string | null;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  startTimeUtc: string;
  endTimeUtc: string;
  location?: string;
  organizerId: string;
  attendeeEmployeeIds: string[];
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  startTimeUtc?: string;
  endTimeUtc?: string;
  location?: string;
  status?: MeetingStatus;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTimeUtc: string;
  endTimeUtc: string;
  location: string | null;
  status: MeetingStatus;
  attendeeCount: number;
  organizerName: string;
}

export interface ScheduleConversation {
  id: string;
  subject: string;
  meetingId: string | null;
  status: ConversationStatus;
  createdByEmployeeId: string;
  createdAt: string;
  lastMessageAt: string | null;
  messages: ConversationMessage[];
  participants: ConversationParticipant[];
}

export interface ConversationSummary {
  id: string;
  subject: string;
  meetingId: string | null;
  status: ConversationStatus;
  createdByEmployeeId: string;
  createdAt: string;
  lastMessageAt: string | null;
  messageCount: number;
  participantCount: number;
}

export interface ConversationMessage {
  id: string;
  senderEmployeeId: string;
  content: string;
  sentAt: string;
}

export interface ConversationParticipant {
  employeeId: string;
  joinedAt: string;
}

export interface CreateConversationRequest {
  subject: string;
  meetingId?: string;
  createdByEmployeeId: string;
  participantEmployeeIds: string[];
  initialMessage?: string;
}

export interface SendMessageRequest {
  senderEmployeeId: string;
  content: string;
}
