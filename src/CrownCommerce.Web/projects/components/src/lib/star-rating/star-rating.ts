import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-star-rating',
  template: `
    <div class="star-rating">
      <span class="star-rating__stars">{{ starsDisplay() }}</span>
      @if (showDetails()) {
        <span class="star-rating__details">
          {{ rating() }} ({{ reviewCount() }} reviews)
        </span>
      }
    </div>
  `,
  styles: `
    .star-rating {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .star-rating__stars {
      font-family: var(--font-body);
      font-size: 16px;
      color: var(--color-gold);
    }

    .star-rating__details {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-secondary);
    }

    @media (max-width: 768px) {
      .star-rating__stars {
        font-size: 14px;
      }

      .star-rating__details {
        font-size: 13px;
      }
    }
  `,
})
export class StarRatingComponent {
  rating = input.required<number>();
  reviewCount = input<number>(0);
  showDetails = input<boolean>(true);

  starsDisplay = computed(() => {
    const full = Math.floor(this.rating());
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  });
}
