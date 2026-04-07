import { api } from "./client";

export interface Notification {
  id: string;
  recipientId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getNotifications: (recipientId?: string) =>
    api.get<Notification[]>("/api/notifications", { params: recipientId ? { recipientId } : undefined }),
  createNotification: (data: Partial<Notification>) => api.post<Notification>("/api/notifications", data),
  markAsRead: (id: string) => api.put<Notification>(`/api/notifications/${id}`, { read: true }),
};
