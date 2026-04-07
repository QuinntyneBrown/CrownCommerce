import { api } from "./client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: string | null;
  tier: string | null;
  orderCount: number | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export const crmApi = {
  getCustomers: () => api.get<Customer[]>("/api/crm/customers"),
  getCustomer: (id: string) => api.get<Customer>(`/api/crm/customers/${id}`),
  createCustomer: (data: Partial<Customer>) => api.post<Customer>("/api/crm/customers", data),
  updateCustomer: (id: string, data: Partial<Customer>) => api.put<Customer>(`/api/crm/customers/${id}`, data),

  getLeads: () => api.get<Lead[]>("/api/crm/leads"),
  getLead: (id: string) => api.get<Lead>(`/api/crm/leads/${id}`),
  createLead: (data: Partial<Lead>) => api.post<Lead>("/api/crm/leads", data),
  updateLead: (id: string, data: Partial<Lead>) => api.put<Lead>(`/api/crm/leads/${id}`, data),
  deleteLead: (id: string) => api.delete(`/api/crm/leads/${id}`),
};
