export type ProductCategory = 'bundles' | 'closures' | 'frontals' | 'bundle-deals';

export interface HairOrigin {
  id: string;
  country: string;
  region: string;
  description: string;
}

export interface HairProduct {
  id: string;
  name: string;
  originId: string;
  originCountry: string;
  texture: string;
  type: string;
  category: ProductCategory;
  lengthInches: number;
  price: number;
  description: string;
  imageUrl: string | null;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  availableLengths: number[];
  features: string[];
  inStock: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProductFilterParams {
  category?: ProductCategory;
  texture?: string;
  lengthInches?: number;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  originId: string;
  originCountry: string;
  texture: string;
  type: string;
  category: ProductCategory;
  lengthInches: number;
  price: number;
  description: string;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  availableLengths: number[];
  features: string[];
  inStock: boolean;
  breadcrumb: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CreateProductReviewRequest {
  customerName: string;
  rating: number;
  content: string;
}

export interface BundleDealItem {
  productId: string;
  productName: string;
  quantity: number;
  lengthInches: number;
}

export interface BundleDeal {
  id: string;
  name: string;
  description: string;
  items: BundleDealItem[];
  originalPrice: number;
  dealPrice: number;
  savingsAmount: number;
  savingsLabel: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CreateOriginRequest {
  country: string;
  region: string;
  description: string;
}

export interface UpdateOriginRequest {
  country: string;
  region: string;
  description: string;
}

export interface CreateProductRequest {
  name: string;
  originId: string;
  texture: string;
  type: string;
  category: ProductCategory;
  lengthInches: number;
  price: number;
  description: string;
  imageUrl?: string;
  availableLengths?: number[];
  features?: string[];
}

export interface UpdateProductRequest {
  name: string;
  originId: string;
  texture: string;
  type: string;
  category: ProductCategory;
  lengthInches: number;
  price: number;
  description: string;
  imageUrl?: string;
  availableLengths?: number[];
  features?: string[];
}
