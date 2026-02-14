import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CatalogService, InquiryService, ContentService, NewsletterService, type HairProduct, type Inquiry, type HairOrigin, type Testimonial, type SubscriberStats } from 'api';

interface MetricCard {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly inquiryService = inject(InquiryService);
  private readonly contentService = inject(ContentService);
  private readonly newsletterService = inject(NewsletterService);

  readonly products = signal<HairProduct[]>([]);
  readonly origins = signal<HairOrigin[]>([]);
  readonly inquiries = signal<Inquiry[]>([]);
  readonly testimonials = signal<Testimonial[]>([]);
  readonly subscriberStats = signal<SubscriberStats | null>(null);

  readonly metrics = computed<MetricCard[]>(() => [
    { label: 'Total Products', value: String(this.products().length), icon: 'inventory_2', iconColor: 'var(--success)' },
    { label: 'Active Inquiries', value: String(this.inquiries().length), icon: 'mail', iconColor: 'var(--info)' },
    { label: 'Hair Origins', value: String(this.origins().length), icon: 'public', iconColor: 'var(--info)' },
    { label: 'Testimonials', value: String(this.testimonials().length), icon: 'star', iconColor: 'var(--success)' },
    { label: 'Subscribers', value: String(this.subscriberStats()?.totalActive ?? 0), icon: 'group', iconColor: 'var(--primary)' },
  ]);

  readonly recentProducts = computed(() => this.products().slice(0, 4));
  readonly recentInquiries = computed(() =>
    this.inquiries().slice(0, 4).map((inq) => ({
      initials: inq.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      name: inq.name,
      message: inq.message,
      time: inq.createdAt,
    }))
  );

  productColumns = ['name', 'type', 'price', 'origin'];

  ngOnInit() {
    this.catalogService.getProducts().subscribe({ next: (d) => this.products.set(d) });
    this.catalogService.getOrigins().subscribe({ next: (d) => this.origins.set(d) });
    this.inquiryService.getInquiries().subscribe({ next: (d) => this.inquiries.set(d) });
    this.contentService.getTestimonials().subscribe({ next: (d) => this.testimonials.set(d) });
    this.newsletterService.getSubscriberStats().subscribe({ next: (d) => this.subscriberStats.set(d) });
  }
}
