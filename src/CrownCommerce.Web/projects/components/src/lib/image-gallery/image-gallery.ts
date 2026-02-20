import { Component, input, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-image-gallery',
  imports: [NgClass],
  template: `
    <div class="gallery">
      <div class="gallery__main">
        @if (currentImage()) {
          <img [src]="currentImage()" [alt]="alt()" />
        }
      </div>
      @if (images().length > 1) {
        <div class="gallery__thumbs">
          @for (image of images(); track image; let i = $index) {
            <button
              class="gallery__thumb"
              [ngClass]="{ 'gallery__thumb--active': i === selectedIndex() }"
              (click)="selectedIndex.set(i)"
            >
              <img [src]="image" [alt]="alt() + ' thumbnail ' + (i + 1)" />
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .gallery {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .gallery__main {
      width: 100%;
      height: 560px;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .gallery__thumbs {
      display: flex;
      gap: 12px;
    }

    .gallery__thumb {
      width: 88px;
      height: 88px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid transparent;
      padding: 0;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s;

      &:hover {
        opacity: 0.8;
      }

      &--active {
        opacity: 1;
        border-color: var(--color-gold);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @media (max-width: 768px) {
      .gallery__main {
        height: 360px;
      }

      .gallery__thumbs {
        gap: 8px;
      }

      .gallery__thumb {
        width: 64px;
        height: 64px;
      }
    }
  `,
})
export class ImageGalleryComponent {
  images = input.required<string[]>();
  alt = input<string>('Product image');

  selectedIndex = signal(0);

  currentImage = computed(() => {
    const imgs = this.images();
    const idx = this.selectedIndex();
    return imgs.length > 0 ? imgs[idx] : '';
  });
}
