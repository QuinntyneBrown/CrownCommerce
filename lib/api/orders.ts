import { api } from "./client";

export interface Order {
  id: string;
  userId: string | null;
  status: string;
  total: string;
  shippingAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string | null;
  createdAt: string;
  items: CartItem[];
}

export const ordersApi = {
  getOrders: () => api.get<Order[]>("/api/orders"),
  getOrder: (id: string) => api.get<Order>(`/api/orders/${id}`),
  createOrder: (data: Partial<Order>) => api.post<Order>("/api/orders", data),
  updateOrder: (id: string, data: Partial<Order>) => api.put<Order>(`/api/orders/${id}`, data),

  getCart: (userId: string) => api.get<Cart>("/api/orders/cart", { params: { userId } }),
  createCart: (data: { userId: string }) => api.post<Cart>("/api/orders/cart", data),
  addCartItem: (data: Partial<CartItem>) => api.post<CartItem>("/api/orders/cart/items", data),
  removeCartItem: (id: string) => api.delete("/api/orders/cart/items", { params: { id } }),
};
