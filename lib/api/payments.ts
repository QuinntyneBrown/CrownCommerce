import { api } from "./client";

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  status: string;
  confirmedAt: string | null;
  refundedAt: string | null;
}

export const paymentsApi = {
  getPayments: () => api.get<Payment[]>("/api/payments"),
  getPayment: (id: string) => api.get<Payment>(`/api/payments/${id}`),
  createPayment: (data: Partial<Payment>) => api.post<Payment>("/api/payments", data),
  updatePayment: (id: string, data: Partial<Payment>) => api.put<Payment>(`/api/payments/${id}`, data),
};
