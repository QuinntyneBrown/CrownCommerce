import { api } from "./client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  texture: string | null;
  type: string | null;
  length: string | null;
  originId: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Origin {
  id: string;
  name: string;
  country: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  content: string | null;
  createdAt: string;
}

export interface BundleDeal {
  id: string;
  name: string;
  items: string;
  originalPrice: string;
  dealPrice: string;
}

export const catalogApi = {
  getProducts: () => api.get<Product[]>("/api/catalog/products"),
  getProduct: (id: string) => api.get<Product>(`/api/catalog/products/${id}`),
  createProduct: (data: Partial<Product>) => api.post<Product>("/api/catalog/products", data),
  updateProduct: (id: string, data: Partial<Product>) => api.put<Product>(`/api/catalog/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/api/catalog/products/${id}`),

  getOrigins: () => api.get<Origin[]>("/api/catalog/origins"),
  getOrigin: (id: string) => api.get<Origin>(`/api/catalog/origins/${id}`),
  createOrigin: (data: Partial<Origin>) => api.post<Origin>("/api/catalog/origins", data),
  updateOrigin: (id: string, data: Partial<Origin>) => api.put<Origin>(`/api/catalog/origins/${id}`, data),
  deleteOrigin: (id: string) => api.delete(`/api/catalog/origins/${id}`),

  getReviews: (productId?: string) => api.get<Review[]>("/api/catalog/reviews", { params: productId ? { productId } : undefined }),
  createReview: (data: Partial<Review>) => api.post<Review>("/api/catalog/reviews", data),

  getBundleDeals: () => api.get<BundleDeal[]>("/api/catalog/bundle-deals"),
  createBundleDeal: (data: Partial<BundleDeal>) => api.post<BundleDeal>("/api/catalog/bundle-deals", data),
};
