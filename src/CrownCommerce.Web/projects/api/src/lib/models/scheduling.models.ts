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
  status: string;
  presence: string;
  lastSeenAt: string | null;
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
  status?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  startTimeUtc: string;
  endTimeUtc: string;
  location: string | null;
  joinUrl: string | null;
  status: string;
  organizerId: string;
  createdAt: string;
  attendees: MeetingAttendee[];
}

export interface MeetingAttendee {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  response: string;
  respondedAt: string | null;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  startTimeUtc: string;
  endTimeUtc: string;
  location?: string;
  isVirtual?: boolean;
  organizerId: string;
  attendeeEmployeeIds: string[];
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  startTimeUtc?: string;
  endTimeUtc?: string;
  location?: string;
  status?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTimeUtc: string;
  endTimeUtc: string;
  location: string | null;
  joinUrl: string | null;
  status: string;
  attendeeCount: number;
  organizerName: string;
}

export interface ScheduleConversation {
  id: string;
  subject: string;
  meetingId: string | null;
  status: string;
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
  status: string;
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

export interface Channel {
  id: string;
  name: string;
  icon: string | null;
  channelType: string;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
  participantCount: number;
}

export interface ChannelMessage {
  id: string;
  senderEmployeeId: string;
  senderName: string;
  senderInitials: string;
  content: string;
  sentAt: string;
  reactions: ReactionSummary[];
  attachments: FileAttachment[];
}

export interface SendChannelMessageRequest {
  senderEmployeeId: string;
  content: string;
  attachmentIds?: string[];
}

export interface UpdateChannelMessageRequest {
  content: string;
}

export interface CreateChannelRequest {
  name: string;
  icon?: string;
  channelType: string;
  createdByEmployeeId: string;
  participantEmployeeIds: string[];
}

export interface MarkAsReadRequest {
  employeeId: string;
}

export interface ActivityFeedItem {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  occurredAt: string;
}

export interface UpdatePresenceRequest {
  presence: string;
}

export interface AddReactionRequest {
  employeeId: string;
  emoji: string;
}

export interface ReactionSummary {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface CallRoom {
  name: string;
  url: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface CallToken {
  token: string;
  roomUrl: string;
}

export interface JoinCallRequest {
  roomName: string;
  userName: string;
  isOwner?: boolean;
}

export interface FileAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  url: string;
  uploadedByEmployeeId: string;
  messageId: string | null;
  uploadedAt: string;
}
