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
  selector: 'feat-frontals-page',
  standalone: true,
  imports: [DividerComponent, ProductCardComponent, FilterChipComponent, LoadingSpinnerComponent, ErrorStateComponent],
  templateUrl: './frontals-page.html',
  styleUrl: './frontals-page.scss',
})
export class FrontalsPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  readonly products = signal<HairProduct[]>([]);
  readonly filteredProducts = signal<HairProduct[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeFilter = signal('All');

  readonly filters = ['All', '13x4', '13x6'];

  ngOnInit(): void {
    this.catalogService.getProductsByCategory('frontals').subscribe({
      next: (result) => {
        this.products.set(result.items);
        this.filteredProducts.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load frontals.');
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
        this.products().filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      );
    }
  }

  navigateToProduct(product: HairProduct): void {
    this.router.navigate(['/product', product.id]);
  }
}
