import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ContentService, type GalleryImage } from 'api';
import { ConfirmDialog } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-gallery-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './gallery-list.html',
  styleUrl: './gallery-list.scss',
})
export class GalleryListPage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly dialog = inject(MatDialog);

  readonly images = signal<GalleryImage[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['title', 'category', 'imageUrl', 'created', 'actions'];

  readonly filteredImages = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.images();
    return this.images().filter(i =>
      i.title?.toLowerCase().includes(term) ||
      i.category?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.contentService.getGallery().subscribe({
      next: (data) => {
        this.images.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load gallery images');
        this.loading.set(false);
      },
    });
  }

  deleteImage(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Image',
        message: 'Are you sure you want to delete this image? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.contentService.deleteGalleryImage(id).subscribe({
        next: () => this.loadImages(),
        error: () => this.error.set('Failed to delete image'),
      });
    });
  }
}
