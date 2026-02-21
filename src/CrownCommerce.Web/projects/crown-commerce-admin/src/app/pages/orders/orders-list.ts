import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService, type Order } from 'api';

@Component({
  selector: 'app-orders-list',
  imports: [
    DatePipe,
    CurrencyPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss',
})
export class OrdersListPage implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['id', 'customerName', 'customerEmail', 'totalAmount', 'status', 'createdAt', 'actions'];

  readonly filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.orders();
    return this.orders().filter(o =>
      o.customerName?.toLowerCase().includes(term) ||
      o.customerEmail?.toLowerCase().includes(term) ||
      o.id?.toLowerCase().includes(term)
    );
  });

  readonly statCards = computed(() => {
    const all = this.orders();
    const pending = all.filter(o => o.status === 'Pending').length;
    const shipped = all.filter(o => o.status === 'Shipped').length;
    const delivered = all.filter(o => o.status === 'Delivered').length;
    const revenue = all.reduce((sum, o) => sum + o.totalAmount, 0);
    return [
      { label: 'Total Orders', value: all.length, icon: 'receipt_long', color: 'var(--primary)' },
      { label: 'Pending', value: pending, icon: 'pending', color: 'var(--warning)' },
      { label: 'Shipped', value: shipped, icon: 'local_shipping', color: 'var(--info)' },
      { label: 'Delivered', value: delivered, icon: 'check_circle', color: 'var(--success)' },
      { label: 'Total Revenue', value: '$' + revenue.toLocaleString(), icon: 'attach_money', color: 'var(--primary)' },
    ];
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load orders');
        this.loading.set(false);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'chip chip--warning';
      case 'Shipped': return 'chip chip--info';
      case 'Delivered': return 'chip chip--success';
      case 'Cancelled': return 'chip chip--error';
      default: return 'chip chip--default';
    }
  }
}
