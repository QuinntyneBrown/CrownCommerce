import { Component, inject, OnInit, signal } from '@angular/core';
import {
  DividerComponent,
  ShippingRateCardComponent,
  ChecklistItemComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { ContentService } from 'api';
import type { ShippingPolicy } from 'api';

@Component({
  selector: 'feat-shipping-info-page',
  standalone: true,
  imports: [
    DividerComponent,
    ShippingRateCardComponent,
    ChecklistItemComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './shipping-info-page.html',
  styleUrl: './shipping-info-page.scss',
})
export class ShippingInfoPage implements OnInit {
  private readonly contentService = inject(ContentService);

  readonly policy = signal<ShippingPolicy | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.contentService.getShippingPolicy().subscribe({
      next: (policy) => {
        this.policy.set(policy);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load shipping information.');
        this.loading.set(false);
      },
    });
  }
}
