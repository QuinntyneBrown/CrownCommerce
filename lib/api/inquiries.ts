import { api } from "./client";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  category: string;
  status: string;
  createdAt: string;
}

export const inquiriesApi = {
  getInquiries: () => api.get<Inquiry[]>("/api/inquiries"),
  getInquiry: (id: string) => api.get<Inquiry>(`/api/inquiries/${id}`),
  createInquiry: (data: Partial<Inquiry>) => api.post<Inquiry>("/api/inquiries", data),
  updateInquiry: (id: string, data: Partial<Inquiry>) => api.put<Inquiry>(`/api/inquiries/${id}`, data),
};
