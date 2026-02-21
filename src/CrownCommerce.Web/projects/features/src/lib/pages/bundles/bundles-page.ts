import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DividerComponent,
  ProductCardComponent,
  FilterChipComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { CatalogService } from 'api';
import type { HairProduct } from 'api';

@Component({
  selector: 'feat-bundles-page',
  standalone: true,
  imports: [
    DividerComponent,
    ProductCardComponent,
    FilterChipComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './bundles-page.html',
  styleUrl: './bundles-page.scss',
})
export class BundlesPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  readonly products = signal<HairProduct[]>([]);
  readonly filteredProducts = signal<HairProduct[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeFilter = signal('All');

  readonly filters = ['All', 'Straight', 'Body Wave', 'Deep Wave', 'Kinky Curly'];

  ngOnInit(): void {
    this.catalogService.getProductsByCategory('bundles').subscribe({
      next: (result) => {
        this.products.set(result.items);
        this.filteredProducts.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load bundles.');
        this.loading.set(false);
      },
    });
  }

  filterBy(filter: string): void {
    this.activeFilter.set(filter);
    if (filter === 'All') {
      this.filteredProducts.set(this.products());
    } else {
      this.filteredProducts.set(
        this.products().filter(p => p.texture.toLowerCase() === filter.toLowerCase())
      );
    }
  }

  navigateToProduct(product: HairProduct): void {
    this.router.navigate(['/product', product.id]);
  }
}
