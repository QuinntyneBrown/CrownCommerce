import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';
import type {
  BrandStory,
  ContentPage,
  CreateFaqRequest,
  CreateGalleryImageRequest,
  CreatePageRequest,
  CreateTestimonialRequest,
  FaqItem,
  GalleryImage,
  HairCareGuide,
  ReturnsPolicy,
  ShippingPolicy,
  Testimonial,
  UpdateFaqRequest,
  UpdateGalleryImageRequest,
  UpdatePageRequest,
  UpdateTestimonialRequest,
  WholesaleTier,
} from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/api/content`;

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.baseUrl}/testimonials`);
  }

  createTestimonial(request: CreateTestimonialRequest): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.baseUrl}/testimonials`, request);
  }

  updateTestimonial(id: string, request: UpdateTestimonialRequest): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.baseUrl}/testimonials/${id}`, request);
  }

  getGallery(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.baseUrl}/gallery`);
  }

  getGalleryByCategory(category: string): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.baseUrl}/gallery/category/${category}`);
  }

  getFaqs(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`${this.baseUrl}/faqs`);
  }

  getFaqsByCategory(category: string): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`${this.baseUrl}/faqs/category/${category}`);
  }

  getPages(): Observable<ContentPage[]> {
    return this.http.get<ContentPage[]>(`${this.baseUrl}/pages`);
  }

  getPage(slug: string): Observable<ContentPage> {
    return this.http.get<ContentPage>(`${this.baseUrl}/pages/${slug}`);
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/testimonials/${id}`);
  }

  getBrandStory(): Observable<BrandStory> {
    return this.http.get<BrandStory>(`${this.baseUrl}/brand-story`);
  }

  getHairCareGuide(): Observable<HairCareGuide> {
    return this.http.get<HairCareGuide>(`${this.baseUrl}/hair-care-guide`);
  }

  getShippingPolicy(): Observable<ShippingPolicy> {
    return this.http.get<ShippingPolicy>(`${this.baseUrl}/shipping-policy`);
  }

  getReturnsPolicy(): Observable<ReturnsPolicy> {
    return this.http.get<ReturnsPolicy>(`${this.baseUrl}/returns-policy`);
  }

  getWholesalePricing(): Observable<WholesaleTier[]> {
    return this.http.get<WholesaleTier[]>(`${this.baseUrl}/wholesale-pricing`);
  }

  // Gallery CRUD
  createGalleryImage(request: CreateGalleryImageRequest): Observable<GalleryImage> {
    return this.http.post<GalleryImage>(`${this.baseUrl}/gallery`, request);
  }

  updateGalleryImage(id: string, request: UpdateGalleryImageRequest): Observable<GalleryImage> {
    return this.http.put<GalleryImage>(`${this.baseUrl}/gallery/${id}`, request);
  }

  deleteGalleryImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/gallery/${id}`);
  }

  // FAQ CRUD
  createFaq(request: CreateFaqRequest): Observable<FaqItem> {
    return this.http.post<FaqItem>(`${this.baseUrl}/faqs`, request);
  }

  updateFaq(id: string, request: UpdateFaqRequest): Observable<FaqItem> {
    return this.http.put<FaqItem>(`${this.baseUrl}/faqs/${id}`, request);
  }

  deleteFaq(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/faqs/${id}`);
  }

  // Page CRUD
  createPage(request: CreatePageRequest): Observable<ContentPage> {
    return this.http.post<ContentPage>(`${this.baseUrl}/pages`, request);
  }

  updatePage(id: string, request: UpdatePageRequest): Observable<ContentPage> {
    return this.http.put<ContentPage>(`${this.baseUrl}/pages/${id}`, request);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pages/${id}`);
  }
}
