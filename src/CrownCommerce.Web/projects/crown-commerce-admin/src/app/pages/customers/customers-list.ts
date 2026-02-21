import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CrmService, type Customer } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-customers-list',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss',
})
export class CustomersListPage implements OnInit {
  private readonly crmService = inject(CrmService);
  private readonly dialog = inject(MatDialog);

  readonly customers = signal<Customer[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['name', 'email', 'status', 'tier', 'totalOrders', 'actions'];

  readonly filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.customers();
    return this.customers().filter(c =>
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  readonly statCards = computed(() => {
    const all = this.customers();
    const active = all.filter(c => c.status === 'Active').length;
    const vip = all.filter(c => c.tier === 'VIP' || c.tier === 'Elite').length;
    const revenue = all.reduce((sum, c) => sum + c.totalSpent, 0);
    return [
      { label: 'Total Customers', value: all.length, icon: 'contacts', color: 'var(--primary)' },
      { label: 'Active', value: active, icon: 'check_circle', color: 'var(--success)' },
      { label: 'VIP', value: vip, icon: 'star', color: 'var(--warning)' },
      { label: 'Total Revenue', value: '$' + revenue.toLocaleString(), icon: 'attach_money', color: 'var(--info)' },
    ];
  });

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.crmService.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load customers');
        this.loading.set(false);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'chip chip--success';
      case 'Inactive': return 'chip chip--warning';
      default: return 'chip chip--default';
    }
  }

  getTierClass(tier: string): string {
    switch (tier) {
      case 'VIP': return 'chip chip--warning';
      case 'Elite': return 'chip chip--elite';
      default: return 'chip chip--default';
    }
  }

  deleteCustomer(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Customer',
        message: 'Are you sure you want to delete this customer? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.crmService.deleteCustomer(id).subscribe({
        next: () => this.loadCustomers(),
        error: () => this.error.set('Failed to delete customer'),
      });
    });
  }
}
