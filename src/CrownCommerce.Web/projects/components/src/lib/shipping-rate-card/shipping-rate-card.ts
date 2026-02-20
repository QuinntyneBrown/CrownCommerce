import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-shipping-rate-card',
  template: `
    <article class="rate-card">
      <span class="rate-card__price">{{ price() }}</span>
      <h3 class="rate-card__title">{{ title() }}</h3>
      <p class="rate-card__description">{{ description() }}</p>
    </article>
  `,
  styles: `
    .rate-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
      border-radius: 16px;
      background: var(--color-bg-card);
    }

    .rate-card__price {
      font-family: var(--font-heading);
      font-size: 36px;
      font-weight: 300;
      color: var(--color-gold);
    }

    .rate-card__title {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-primary);
      margin: 0;
    }

    .rate-card__description {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-secondary);
      text-align: center;
      margin: 0;
    }

    @media (max-width: 768px) {
      .rate-card {
        padding: 24px;
      }

      .rate-card__price {
        font-size: 28px;
      }
    }
  `,
})
export class ShippingRateCardComponent {
  price = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
