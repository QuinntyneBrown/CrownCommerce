import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductCardComponent,
  SectionHeaderComponent,
  DividerComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { CatalogService } from 'api';
import type { HairProduct } from 'api';

@Component({
  selector: 'feat-shop-page',
  standalone: true,
  imports: [
    ProductCardComponent,
    SectionHeaderComponent,
    DividerComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './shop-page.html',
  styleUrl: './shop-page.scss',
})
export class ShopPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly allProducts = signal<HairProduct[]>([]);
  readonly filteredProducts = signal<HairProduct[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly activeCategory = signal<string | null>(null);
  readonly activeTexture = signal<string | null>(null);
  readonly activeLength = signal<number | null>(null);
  readonly activePriceRange = signal<string | null>(null);
  readonly sortBy = signal<string>('name');

  readonly categories = ['Bundles', 'Closures', 'Frontals', 'Wigs'];
  readonly textures = ['Straight', 'Body Wave', 'Deep Wave', 'Kinky Curly'];
  readonly lengths = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
  readonly priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 – $100', min: 50, max: 100 },
    { label: '$100 – $150', min: 100, max: 150 },
    { label: '$150+', min: 150, max: Infinity },
  ];

  readonly productCount = computed(() => this.filteredProducts().length);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.activeCategory.set(this.capitalizeFirst(params['category']));
      }
    });
    this.loadProducts();
  }

  filterByCategory(category: string | null): void {
    this.activeCategory.set(category);
    this.applyFilters();
  }

  filterByTexture(texture: string | null): void {
    this.activeTexture.set(texture);
    this.applyFilters();
  }

  filterByLength(length: number | null): void {
    this.activeLength.set(length);
    this.applyFilters();
  }

  filterByPrice(range: string | null): void {
    this.activePriceRange.set(range);
    this.applyFilters();
  }

  sortProducts(sort: string): void {
    this.sortBy.set(sort);
    this.applyFilters();
  }

  navigateToProduct(product: HairProduct): void {
    this.router.navigate(['/product', product.id]);
  }

  formatPrice(product: HairProduct): string {
    return `$${product.price} CAD`;
  }

  private loadProducts(): void {
    this.catalogService.getProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products.');
        this.loading.set(false);
      },
    });
  }

  private applyFilters(): void {
    let products = [...this.allProducts()];

    const category = this.activeCategory();
    if (category) {
      products = products.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase() ||
        p.type?.toLowerCase() === category.toLowerCase()
      );
    }

    const texture = this.activeTexture();
    if (texture) {
      products = products.filter(p => p.texture.toLowerCase() === texture.toLowerCase());
    }

    const length = this.activeLength();
    if (length) {
      products = products.filter(p => p.lengthInches === length);
    }

    const priceLabel = this.activePriceRange();
    if (priceLabel) {
      const range = this.priceRanges.find(r => r.label === priceLabel);
      if (range) {
        products = products.filter(p => p.price >= range.min && p.price < range.max);
      }
    }

    const sort = this.sortBy();
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProducts.set(products);
  }

  private capitalizeFirst(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }
}
