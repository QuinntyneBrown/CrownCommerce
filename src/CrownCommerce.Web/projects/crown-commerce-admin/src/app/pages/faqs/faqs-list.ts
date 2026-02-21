import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ContentService, type FaqItem } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-faqs-list',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './faqs-list.html',
  styleUrl: './faqs-list.scss',
})
export class FaqsListPage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly dialog = inject(MatDialog);

  readonly faqs = signal<FaqItem[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['question', 'answer', 'category', 'actions'];

  readonly filteredFaqs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.faqs();
    return this.faqs().filter(f =>
      f.question?.toLowerCase().includes(term) ||
      f.category?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadFaqs();
  }

  loadFaqs() {
    this.contentService.getFaqs().subscribe({
      next: (data) => {
        this.faqs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load FAQs');
        this.loading.set(false);
      },
    });
  }

  truncate(text: string, length = 80): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  deleteFaq(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete FAQ',
        message: 'Are you sure you want to delete this FAQ? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.contentService.deleteFaq(id).subscribe({
        next: () => this.loadFaqs(),
        error: () => this.error.set('Failed to delete FAQ'),
      });
    });
  }
}
