import { api } from "./client";

export interface Page {
  id: string;
  title: string;
  slug: string;
  body: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
  location: string | null;
}

export interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
  category: string | null;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
}

export interface TrustBarItem {
  id: string;
  icon: string;
  text: string;
  description: string | null;
}

export const contentApi = {
  getPages: () => api.get<Page[]>("/api/content/pages"),
  getPage: (id: string) => api.get<Page>(`/api/content/pages/${id}`),
  createPage: (data: Partial<Page>) => api.post<Page>("/api/content/pages", data),
  updatePage: (id: string, data: Partial<Page>) => api.put<Page>(`/api/content/pages/${id}`, data),
  deletePage: (id: string) => api.delete(`/api/content/pages/${id}`),

  getFaqs: () => api.get<FAQ[]>("/api/content/faqs"),
  createFaq: (data: Partial<FAQ>) => api.post<FAQ>("/api/content/faqs", data),
  updateFaq: (id: string, data: Partial<FAQ>) => api.put<FAQ>(`/api/content/faqs/${id}`, data),
  deleteFaq: (id: string) => api.delete(`/api/content/faqs/${id}`),

  getTestimonials: () => api.get<Testimonial[]>("/api/content/testimonials"),
  createTestimonial: (data: Partial<Testimonial>) => api.post<Testimonial>("/api/content/testimonials", data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) => api.put<Testimonial>(`/api/content/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/api/content/testimonials/${id}`),

  getGallery: () => api.get<GalleryImage[]>("/api/content/gallery"),
  addGalleryImage: (data: Partial<GalleryImage>) => api.post<GalleryImage>("/api/content/gallery", data),

  getHeroContent: () => api.get<HeroContent[]>("/api/content/hero"),
  createHeroContent: (data: Partial<HeroContent>) => api.post<HeroContent>("/api/content/hero", data),

  getTrustBar: () => api.get<TrustBarItem[]>("/api/content/trust-bar"),
  createTrustBarItem: (data: Partial<TrustBarItem>) => api.post<TrustBarItem>("/api/content/trust-bar", data),
};
