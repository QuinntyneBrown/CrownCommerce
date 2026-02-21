import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ContentService, type ContentPage } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-content-pages-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './content-pages-list.html',
  styleUrl: './content-pages-list.scss',
})
export class ContentPagesListPage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly dialog = inject(MatDialog);

  readonly pages = signal<ContentPage[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['title', 'slug', 'created', 'actions'];

  readonly filteredPages = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.pages();
    return this.pages().filter(p =>
      p.title?.toLowerCase().includes(term) ||
      p.slug?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    this.contentService.getPages().subscribe({
      next: (data) => {
        this.pages.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load content pages');
        this.loading.set(false);
      },
    });
  }

  deletePage(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Page',
        message: 'Are you sure you want to delete this page? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.contentService.deletePage(id).subscribe({
        next: () => this.loadPages(),
        error: () => this.error.set('Failed to delete page'),
      });
    });
  }
}
