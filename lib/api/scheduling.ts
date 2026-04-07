import { api } from "./client";

export interface Employee {
  id: string;
  userId: string | null;
  name: string;
  role: string | null;
  department: string | null;
  timezone: string | null;
  presence: string | null;
  avatarUrl: string | null;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  createdBy: string | null;
  createdAt: string;
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  attachments: string | null;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  organizerId: string | null;
}

export const schedulingApi = {
  getEmployees: () => api.get<Employee[]>("/api/scheduling/employees"),
  getEmployee: (id: string) => api.get<Employee>(`/api/scheduling/employees/${id}`),
  createEmployee: (data: Partial<Employee>) => api.post<Employee>("/api/scheduling/employees", data),
  updateEmployee: (id: string, data: Partial<Employee>) => api.put<Employee>(`/api/scheduling/employees/${id}`, data),
  deleteEmployee: (id: string) => api.delete(`/api/scheduling/employees/${id}`),

  getChannels: () => api.get<Channel[]>("/api/scheduling/channels"),
  createChannel: (data: Partial<Channel>) => api.post<Channel>("/api/scheduling/channels", data),
  getChannelMessages: (channelId: string) => api.get<ChannelMessage[]>(`/api/scheduling/channels/${channelId}/messages`),
  sendChannelMessage: (channelId: string, data: { senderId: string; content: string }) => api.post<ChannelMessage>(`/api/scheduling/channels/${channelId}/messages`, data),

  getMeetings: () => api.get<Meeting[]>("/api/scheduling/meetings"),
  getMeeting: (id: string) => api.get<Meeting>(`/api/scheduling/meetings/${id}`),
  createMeeting: (data: Partial<Meeting>) => api.post<Meeting>("/api/scheduling/meetings", data),
  updateMeeting: (id: string, data: Partial<Meeting>) => api.put<Meeting>(`/api/scheduling/meetings/${id}`, data),
  deleteMeeting: (id: string) => api.delete(`/api/scheduling/meetings/${id}`),

  getFiles: () => api.get("/api/scheduling/files"),
  uploadFile: (data: { filename: string; url: string; contentType?: string; uploadedBy?: string }) => api.post("/api/scheduling/files", data),
};
