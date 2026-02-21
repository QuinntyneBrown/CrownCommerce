import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CrmService, type Lead } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-leads-list',
  imports: [
    CurrencyPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './leads-list.html',
  styleUrl: './leads-list.scss',
})
export class LeadsListPage implements OnInit {
  private readonly crmService = inject(CrmService);
  private readonly dialog = inject(MatDialog);

  readonly leads = signal<Lead[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['name', 'company', 'source', 'status', 'revenue', 'actions'];

  readonly filteredLeads = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.leads();
    return this.leads().filter(l =>
      l.name?.toLowerCase().includes(term) ||
      l.company?.toLowerCase().includes(term) ||
      l.email?.toLowerCase().includes(term)
    );
  });

  readonly statCards = computed(() => {
    const all = this.leads();
    const newLeads = all.filter(l => l.leadStatus === 'New').length;
    const qualified = all.filter(l => l.leadStatus === 'Qualified').length;
    const won = all.filter(l => l.leadStatus === 'Won').length;
    return [
      { label: 'Total Leads', value: all.length, icon: 'trending_up', color: 'var(--primary)' },
      { label: 'New', value: newLeads, icon: 'fiber_new', color: 'var(--info)' },
      { label: 'Qualified', value: qualified, icon: 'verified', color: 'var(--success)' },
      { label: 'Won', value: won, icon: 'emoji_events', color: 'var(--warning)' },
    ];
  });

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.crmService.getLeads().subscribe({
      next: (data) => {
        this.leads.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load leads');
        this.loading.set(false);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'New': return 'chip chip--info';
      case 'Qualified': return 'chip chip--success';
      case 'Won': return 'chip chip--warning';
      case 'Lost': return 'chip chip--error';
      default: return 'chip chip--default';
    }
  }

  deleteLead(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Lead',
        message: 'Are you sure you want to delete this lead? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.crmService.deleteLead(id).subscribe({
        next: () => this.loadLeads(),
        error: () => this.error.set('Failed to delete lead'),
      });
    });
  }
}
