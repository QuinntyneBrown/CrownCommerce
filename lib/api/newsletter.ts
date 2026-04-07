import { api } from "./client";

export interface Subscriber {
  id: string;
  email: string;
  brandTag: string | null;
  status: string;
  confirmedAt: string | null;
  createdAt: string;
}

export interface Campaign {
  id: string;
  subject: string;
  htmlBody: string | null;
  textBody: string | null;
  tag: string | null;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
}

export const newsletterApi = {
  getSubscribers: () => api.get<Subscriber[]>("/api/newsletter/subscribers"),
  subscribe: (data: { email: string; brandTag?: string }) => api.post<Subscriber>("/api/newsletter/subscribers", data),
  deleteSubscriber: (id: string) => api.delete(`/api/newsletter/subscribers/${id}`),

  getCampaigns: () => api.get<Campaign[]>("/api/newsletter/campaigns"),
  getCampaign: (id: string) => api.get<Campaign>(`/api/newsletter/campaigns/${id}`),
  createCampaign: (data: Partial<Campaign>) => api.post<Campaign>("/api/newsletter/campaigns", data),
  updateCampaign: (id: string, data: Partial<Campaign>) => api.put<Campaign>(`/api/newsletter/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/api/newsletter/campaigns/${id}`),
};
