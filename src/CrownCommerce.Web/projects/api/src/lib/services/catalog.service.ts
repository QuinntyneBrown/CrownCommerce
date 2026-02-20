import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';
import type { PagedResult } from '../models/common.models';
import type {
  BundleDeal,
  CreateOriginRequest,
  CreateProductRequest,
  CreateProductReviewRequest,
  HairOrigin,
  HairProduct,
  ProductDetail,
  ProductFilterParams,
  ProductReview,
  UpdateOriginRequest,
  UpdateProductRequest,
} from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/api/catalog`;

  getProducts(): Observable<HairProduct[]> {
    return this.http.get<HairProduct[]>(`${this.baseUrl}/products`);
  }

  getProduct(id: string): Observable<HairProduct> {
    return this.http.get<HairProduct>(`${this.baseUrl}/products/${id}`);
  }

  getProductDetail(id: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/products/${id}/detail`);
  }

  getProductsByOrigin(originId: string): Observable<HairProduct[]> {
    return this.http.get<HairProduct[]>(`${this.baseUrl}/products/by-origin/${originId}`);
  }

  getProductsByCategory(category: string, params?: ProductFilterParams): Observable<PagedResult<HairProduct>> {
    let httpParams = new HttpParams();
    if (params?.texture) httpParams = httpParams.set('texture', params.texture);
    if (params?.lengthInches) httpParams = httpParams.set('lengthInches', params.lengthInches.toString());
    if (params?.size) httpParams = httpParams.set('size', params.size);
    if (params?.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    return this.http.get<PagedResult<HairProduct>>(`${this.baseUrl}/products/category/${category}`, { params: httpParams });
  }

  searchProducts(params: ProductFilterParams): Observable<PagedResult<HairProduct>> {
    let httpParams = new HttpParams();
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.texture) httpParams = httpParams.set('texture', params.texture);
    if (params.lengthInches) httpParams = httpParams.set('lengthInches', params.lengthInches.toString());
    if (params.size) httpParams = httpParams.set('size', params.size);
    if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    return this.http.get<PagedResult<HairProduct>>(`${this.baseUrl}/products/search`, { params: httpParams });
  }

  getProductReviews(productId: string, page?: number, pageSize?: number): Observable<PagedResult<ProductReview>> {
    let httpParams = new HttpParams();
    if (page) httpParams = httpParams.set('page', page.toString());
    if (pageSize) httpParams = httpParams.set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<ProductReview>>(`${this.baseUrl}/products/${productId}/reviews`, { params: httpParams });
  }

  createProductReview(productId: string, request: CreateProductReviewRequest): Observable<ProductReview> {
    return this.http.post<ProductReview>(`${this.baseUrl}/products/${productId}/reviews`, request);
  }

  getRelatedProducts(productId: string): Observable<HairProduct[]> {
    return this.http.get<HairProduct[]>(`${this.baseUrl}/products/${productId}/related`);
  }

  getBundleDeals(): Observable<BundleDeal[]> {
    return this.http.get<BundleDeal[]>(`${this.baseUrl}/bundle-deals`);
  }

  getBundleDeal(id: string): Observable<BundleDeal> {
    return this.http.get<BundleDeal>(`${this.baseUrl}/bundle-deals/${id}`);
  }

  createProduct(request: CreateProductRequest): Observable<HairProduct> {
    return this.http.post<HairProduct>(`${this.baseUrl}/products`, request);
  }

  updateProduct(id: string, request: UpdateProductRequest): Observable<HairProduct> {
    return this.http.put<HairProduct>(`${this.baseUrl}/products/${id}`, request);
  }

  getOrigins(): Observable<HairOrigin[]> {
    return this.http.get<HairOrigin[]>(`${this.baseUrl}/origins`);
  }

  getOrigin(id: string): Observable<HairOrigin> {
    return this.http.get<HairOrigin>(`${this.baseUrl}/origins/${id}`);
  }

  createOrigin(request: CreateOriginRequest): Observable<HairOrigin> {
    return this.http.post<HairOrigin>(`${this.baseUrl}/origins`, request);
  }

  updateOrigin(id: string, request: UpdateOriginRequest): Observable<HairOrigin> {
    return this.http.put<HairOrigin>(`${this.baseUrl}/origins/${id}`, request);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  deleteOrigin(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/origins/${id}`);
  }
}
