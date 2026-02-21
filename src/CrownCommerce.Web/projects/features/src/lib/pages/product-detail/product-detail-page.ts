import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonComponent,
  BreadcrumbComponent,
  ImageGalleryComponent,
  StarRatingComponent,
  LengthSelectorComponent,
  QuantitySelectorComponent,
  ChecklistItemComponent,
  ReviewCardComponent,
  ProductCardComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
  DividerComponent,
} from 'components';
import { CatalogService, OrderService } from 'api';
import type { ProductDetail, ProductReview, HairProduct } from 'api';

@Component({
  selector: 'feat-product-detail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    BreadcrumbComponent,
    ImageGalleryComponent,
    StarRatingComponent,
    LengthSelectorComponent,
    QuantitySelectorComponent,
    ChecklistItemComponent,
    ReviewCardComponent,
    ProductCardComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    DividerComponent,
  ],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly orderService = inject(OrderService);

  readonly product = signal<ProductDetail | null>(null);
  readonly reviews = signal<ProductReview[]>([]);
  readonly relatedProducts = signal<HairProduct[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly selectedLength = signal('');
  readonly quantity = signal(1);
  readonly addingToCart = signal(false);
  readonly addedToCart = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.catalogService.getProductDetail(id).subscribe({
      next: (product) => {
        this.product.set(product);
        if (product.availableLengths.length > 0) {
          this.selectedLength.set(product.availableLengths[0] + '"');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Product not found.');
        this.loading.set(false);
      },
    });

    this.catalogService.getProductReviews(id, 1, 3).subscribe({
      next: (result) => this.reviews.set(result.items),
    });

    this.catalogService.getRelatedProducts(id).subscribe({
      next: (products) => this.relatedProducts.set(products),
    });
  }

  get productImages(): string[] {
    const p = this.product();
    return p?.images?.map(img => img.url) ?? [];
  }

  get availableLengthStrings(): string[] {
    const p = this.product();
    return p?.availableLengths?.map(l => l + '"') ?? [];
  }

  get breadcrumbLabels(): string[] {
    const p = this.product();
    return p?.breadcrumb?.map(b => b.label) ?? [];
  }

  get cartButtonText(): string {
    const p = this.product();
    if (this.addingToCart()) return 'ADDING...';
    if (this.addedToCart()) return 'ADDED TO CART';
    return p ? `ADD TO CART — $${p.price.toFixed(2)}` : 'ADD TO CART';
  }

  onLengthChange(length: string): void {
    this.selectedLength.set(length);
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;

    this.addingToCart.set(true);
    const sessionId = sessionStorage.getItem('cartSessionId') ?? crypto.randomUUID();
    sessionStorage.setItem('cartSessionId', sessionId);

    this.orderService.addToCart(sessionId, {
      productId: p.id,
      productName: p.name,
      unitPrice: p.price,
      quantity: this.quantity(),
    }).subscribe({
      next: () => {
        this.addingToCart.set(false);
        this.addedToCart.set(true);
        setTimeout(() => this.addedToCart.set(false), 3000);
      },
      error: () => {
        this.addingToCart.set(false);
      },
    });
  }

  navigateToProduct(product: HairProduct): void {
    this.router.navigate(['/product', product.id]);
  }

  navigateToReviews(): void {
    document.querySelector('.product-detail__reviews')?.scrollIntoView({ behavior: 'smooth' });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  }
}
