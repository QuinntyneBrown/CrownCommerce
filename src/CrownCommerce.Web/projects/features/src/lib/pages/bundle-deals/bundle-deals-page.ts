import { Component, inject, OnInit, signal } from '@angular/core';
import {
  DividerComponent,
  BundleDealCardComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { CatalogService, OrderService } from 'api';
import type { BundleDeal } from 'api';

@Component({
  selector: 'feat-bundle-deals-page',
  standalone: true,
  imports: [
    DividerComponent,
    BundleDealCardComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './bundle-deals-page.html',
  styleUrl: './bundle-deals-page.scss',
})
export class BundleDealsPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly orderService = inject(OrderService);

  readonly deals = signal<BundleDeal[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.catalogService.getBundleDeals().subscribe({
      next: (deals) => {
        this.deals.set(deals);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load bundle deals.');
        this.loading.set(false);
      },
    });
  }

  addToCart(deal: BundleDeal): void {
    const sessionId = sessionStorage.getItem('cartSessionId') ?? crypto.randomUUID();
    sessionStorage.setItem('cartSessionId', sessionId);

    this.orderService.addToCart(sessionId, {
      productId: deal.id,
      productName: deal.name,
      unitPrice: deal.dealPrice,
      quantity: 1,
    }).subscribe();
  }
}
