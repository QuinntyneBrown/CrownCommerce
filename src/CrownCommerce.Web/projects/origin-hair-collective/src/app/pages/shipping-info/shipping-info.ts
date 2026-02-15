import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from 'components';
import { ContentService } from 'api';

@Component({
  selector: 'app-shipping-info',
  imports: [SectionHeaderComponent],
  template: `
    <section class="content-page">
      <lib-section-header label="SUPPORT" heading="Shipping Information" />
      @if (body()) {
        <div class="content-page__body" [innerHTML]="body()"></div>
      } @else {
        <p class="content-page__loading">Loading...</p>
      }
    </section>
  `,
  styleUrl: './shipping-info.scss',
})
export class ShippingInfoPage implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly body = signal('');

  ngOnInit(): void {
    this.contentService.getPage('shipping-info').subscribe({
      next: (page) => this.body.set(page.body),
      error: () => this.body.set('<p>Shipping information is currently unavailable.</p>'),
    });
  }
}
