export interface TeamMember {
  id: number;
  name: string;
  initials: string;
  role: string;
  department: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  email: string;
  employeeId?: string;
}

export interface ChatChannel {
  id: number;
  name: string;
  icon: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isPrivate: boolean;
}

export interface ChatMessage {
  id: number;
  channelId: number;
  senderId: number;
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  apiId?: string;
  reactions?: { emoji: string; count: number; hasReacted: boolean }[];
  attachments?: { id: string; fileName: string; contentType: string; sizeBytes: number; url: string }[];
}

export interface Meeting {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  participants: { name: string; initials: string }[];
  location?: string;
  isVirtual: boolean;
  joinUrl?: string;
  apiId?: string;
  rsvpStatus?: 'Pending' | 'Accepted' | 'Declined' | 'Tentative';
}

export interface ActivityItem {
  id: number;
  type: 'message' | 'meeting' | 'task' | 'file';
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

export interface TimeZoneCard {
  city: string;
  timezone: string;
  offset: string;
  flag: string;
}

export const TIME_ZONES: TimeZoneCard[] = [
  { city: 'San Francisco', timezone: 'PST', offset: 'UTC-8', flag: '🇺🇸' },
  { city: 'New York', timezone: 'EST', offset: 'UTC-5', flag: '🇺🇸' },
  { city: 'London', timezone: 'GMT', offset: 'UTC+0', flag: '🇬🇧' },
  { city: 'Nairobi', timezone: 'EAT', offset: 'UTC+3', flag: '🇰🇪' },
  { city: 'Tokyo', timezone: 'JST', offset: 'UTC+9', flag: '🇯🇵' },
  { city: 'Sydney', timezone: 'AEDT', offset: 'UTC+11', flag: '🇦🇺' },
];
