import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewsletterService, type Subscriber, type SubscriberStats } from 'api';

type BrandFilter = 'all' | 'origin-coming-soon' | 'mane-haus-coming-soon';

@Component({
  selector: 'app-subscribers-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './subscribers-list.html',
  styleUrl: './subscribers-list.scss',
})
export class SubscribersListPage implements OnInit {
  private readonly newsletterService = inject(NewsletterService);

  readonly subscribers = signal<Subscriber[]>([]);
  readonly stats = signal<SubscriberStats | null>(null);
  readonly selectedBrand = signal<BrandFilter>('all');
  readonly totalCount = signal(0);

  readonly displayedColumns = ['email', 'status', 'brand', 'date', 'actions'];

  readonly statCards = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Active', value: s.totalActive, icon: 'check_circle', color: 'var(--success)' },
      { label: 'Pending', value: s.totalPending, icon: 'pending', color: 'var(--warning)' },
      { label: 'Unsubscribed', value: s.totalUnsubscribed, icon: 'unsubscribe', color: 'var(--error)' },
      { label: 'Recent (7d)', value: s.recentSubscribers, icon: 'trending_up', color: 'var(--info)' },
    ];
  });

  ngOnInit() {
    this.loadSubscribers();
    this.loadStats();
  }

  onBrandChange(brand: BrandFilter) {
    this.selectedBrand.set(brand);
    this.loadSubscribers();
  }

  loadSubscribers() {
    const brand = this.selectedBrand();
    const tag = brand === 'all' ? undefined : brand;
    this.newsletterService.getSubscribers({ pageSize: 50, tag }).subscribe({
      next: (result) => {
        this.subscribers.set(result.items);
        this.totalCount.set(result.totalCount);
      },
    });
  }

  loadStats() {
    this.newsletterService.getSubscriberStats().subscribe({
      next: (data) => this.stats.set(data),
    });
  }

  getBrandLabel(tags: string[]): string {
    if (tags.includes('origin-coming-soon')) return 'Origin Hair';
    if (tags.includes('mane-haus-coming-soon')) return 'Mane Haus';
    return 'Other';
  }

  getBrandClass(tags: string[]): string {
    if (tags.includes('origin-coming-soon')) return 'chip chip--default';
    if (tags.includes('mane-haus-coming-soon')) return 'chip chip--mane-haus';
    return 'chip chip--default';
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'chip chip--success';
      case 'pending': return 'chip chip--warning';
      case 'unsubscribed': return 'chip chip--error';
      default: return 'chip chip--default';
    }
  }

  deleteSubscriber(id: string) {
    this.newsletterService.deleteSubscriber(id).subscribe({
      next: () => {
        this.loadSubscribers();
        this.loadStats();
      },
    });
  }
}
