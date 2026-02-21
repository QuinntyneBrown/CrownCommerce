import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { NewsletterService, type Campaign } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-campaigns-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './campaigns-list.html',
  styleUrl: './campaigns-list.scss',
})
export class CampaignsListPage implements OnInit {
  private readonly newsletterService = inject(NewsletterService);
  private readonly dialog = inject(MatDialog);

  readonly campaigns = signal<Campaign[]>([]);
  readonly totalCount = signal(0);
  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = 20;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['subject', 'status', 'recipients', 'sent', 'opened', 'scheduledAt', 'actions'];

  readonly filteredCampaigns = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.campaigns();
    return this.campaigns().filter(c =>
      c.subject?.toLowerCase().includes(term)
    );
  });

  readonly statCards = computed(() => {
    const all = this.campaigns();
    const draft = all.filter(c => c.status === 'Draft').length;
    const sent = all.filter(c => c.status === 'Sent').length;
    const scheduled = all.filter(c => c.status === 'Scheduled').length;
    return [
      { label: 'Total Campaigns', value: all.length, icon: 'campaign', color: 'var(--primary)' },
      { label: 'Draft', value: draft, icon: 'edit_note', color: 'var(--warning)' },
      { label: 'Sent', value: sent, icon: 'send', color: 'var(--success)' },
      { label: 'Scheduled', value: scheduled, icon: 'schedule', color: 'var(--info)' },
    ];
  });

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    const page = this.pageIndex() + 1;
    this.newsletterService.getCampaigns({ pageSize: this.pageSize, page }).subscribe({
      next: (result) => {
        this.campaigns.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load campaigns');
        this.loading.set(false);
      },
    });
  }

  previousPage() {
    if (this.pageIndex() > 0) {
      this.pageIndex.update(i => i - 1);
      this.loadCampaigns();
    }
  }

  nextPage() {
    if ((this.pageIndex() + 1) * this.pageSize < this.totalCount()) {
      this.pageIndex.update(i => i + 1);
      this.loadCampaigns();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'chip chip--warning';
      case 'Sent': return 'chip chip--success';
      case 'Scheduled': return 'chip chip--info';
      case 'Cancelled': return 'chip chip--error';
      default: return 'chip chip--default';
    }
  }

  deleteCampaign(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Campaign',
        message: 'Are you sure you want to delete this campaign? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.newsletterService.deleteCampaign(id).subscribe({
        next: () => this.loadCampaigns(),
        error: () => this.error.set('Failed to delete campaign'),
      });
    });
  }
}
