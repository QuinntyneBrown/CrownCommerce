import { api } from "./client";

export interface Conversation {
  id: string;
  userId: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
}

export const chatApi = {
  getConversations: () => api.get<Conversation[]>("/api/chat/conversations"),
  createConversation: (data?: { userId?: string }) => api.post<Conversation>("/api/chat/conversations", data || {}),
  getMessages: (conversationId: string) => api.get<Message[]>(`/api/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, data: { role: string; content: string }) => api.post<Message>(`/api/chat/conversations/${conversationId}/messages`, data),
};
