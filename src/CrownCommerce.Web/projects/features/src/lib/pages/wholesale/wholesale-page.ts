import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DividerComponent,
  ButtonComponent,
  BenefitCardComponent,
  PricingTierCardComponent,
  FormInputComponent,
  FormTextareaComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { ContentService, InquiryService } from 'api';
import type { WholesaleTier } from 'api';

@Component({
  selector: 'feat-wholesale-page',
  standalone: true,
  imports: [
    FormsModule,
    DividerComponent,
    ButtonComponent,
    BenefitCardComponent,
    PricingTierCardComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './wholesale-page.html',
  styleUrl: './wholesale-page.scss',
})
export class WholesalePage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly inquiryService = inject(InquiryService);

  readonly tiers = signal<WholesaleTier[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal<string | null>(null);

  businessName = '';
  contactEmail = '';
  phone = '';
  monthlyVolume = '';
  message = '';

  readonly benefits = [
    { icon: '💰', title: 'Competitive Pricing', description: 'Volume-based discounts with transparent tier pricing for your business.' },
    { icon: '🚚', title: 'Priority Shipping', description: 'Fast-tracked orders with dedicated shipping lanes for wholesale partners.' },
    { icon: '🤝', title: 'Dedicated Support', description: 'Personal account manager and priority support for all wholesale inquiries.' },
  ];

  readonly volumeOptions = [
    { label: 'Select volume', value: '' },
    { label: '10-50 units/month', value: '10-50' },
    { label: '50-100 units/month', value: '50-100' },
    { label: '100-500 units/month', value: '100-500' },
    { label: '500+ units/month', value: '500+' },
  ];

  ngOnInit(): void {
    this.contentService.getWholesalePricing().subscribe({
      next: (tiers) => {
        this.tiers.set(tiers);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load wholesale information.');
        this.loading.set(false);
      },
    });
  }

  submitInquiry(): void {
    if (!this.businessName || !this.contactEmail || !this.message) {
      this.submitError.set('Please fill in all required fields.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.inquiryService.createWholesaleInquiry({
      businessName: this.businessName,
      contactEmail: this.contactEmail,
      phone: this.phone,
      monthlyVolume: this.monthlyVolume,
      message: this.message,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Failed to submit inquiry. Please try again.');
      },
    });
  }
}
