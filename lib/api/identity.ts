import { api } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const identityApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/api/identity/auth", { action: "register", ...data }),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/api/identity/auth", { action: "login", ...data }),

  logout: () => api.post("/api/identity/auth", { action: "logout" }),

  getProfile: () => api.post("/api/identity/auth", { action: "profile" }),

  getUsers: () => api.get<User[]>("/api/identity/users"),
  getUser: (id: string) => api.get<User>(`/api/identity/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put<User>(`/api/identity/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/api/identity/users/${id}`),
};
