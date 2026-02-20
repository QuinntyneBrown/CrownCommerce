import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-review-card',
  template: `
    <article class="review-card">
      <div class="review-card__header">
        <span class="review-card__name">{{ customerName() }}</span>
        <span class="review-card__stars">{{ starsDisplay() }}</span>
      </div>
      <p class="review-card__content">{{ content() }}</p>
      <span class="review-card__date">{{ date() }}</span>
    </article>
  `,
  styles: `
    .review-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px;
      border-radius: 12px;
      background: var(--color-bg-card);
    }

    .review-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .review-card__name {
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .review-card__stars {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-gold);
    }

    .review-card__content {
      font-family: var(--font-body);
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .review-card__date {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--color-text-muted);
    }

    @media (max-width: 768px) {
      .review-card {
        padding: 20px;
        gap: 12px;
      }

      .review-card__content {
        font-size: 13px;
      }
    }
  `,
})
export class ReviewCardComponent {
  customerName = input.required<string>();
  rating = input<number>(5);
  content = input.required<string>();
  date = input.required<string>();

  starsDisplay = computed(() => {
    const full = Math.floor(this.rating());
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  });
}
