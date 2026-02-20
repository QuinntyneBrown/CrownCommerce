import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-bundle-deal-card',
  template: `
    <article class="deal-card">
      <div class="deal-card__image">
        @if (imageUrl()) {
          <img [src]="imageUrl()" [alt]="title()" />
        }
      </div>
      <div class="deal-card__body">
        @if (savingsLabel()) {
          <span class="deal-card__badge">{{ savingsLabel() }}</span>
        }
        <h3 class="deal-card__title">{{ title() }}</h3>
        <p class="deal-card__description">{{ description() }}</p>
        <div class="deal-card__pricing">
          <span class="deal-card__deal-price">{{ dealPrice() }}</span>
          @if (originalPrice()) {
            <span class="deal-card__original-price">{{ originalPrice() }}</span>
          }
        </div>
        <button class="deal-card__cta" (click)="addToCart.emit(); $event.stopPropagation()">
          ADD TO CART
        </button>
      </div>
    </article>
  `,
  styles: `
    .deal-card {
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      background: var(--color-bg-card);
      overflow: hidden;
    }

    .deal-card__image {
      width: 100%;
      height: 240px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .deal-card__body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 20px;
    }

    .deal-card__badge {
      align-self: flex-start;
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      color: var(--color-gold);
      background: #2A2520;
      padding: 4px 12px;
      border-radius: 12px;
      text-transform: uppercase;
    }

    .deal-card__title {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .deal-card__description {
      font-family: var(--font-body);
      font-size: 13px;
      line-height: 1.5;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .deal-card__pricing {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .deal-card__deal-price {
      font-family: var(--font-body);
      font-size: 20px;
      font-weight: 700;
      color: var(--color-gold);
    }

    .deal-card__original-price {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-muted);
      text-decoration: line-through;
    }

    .deal-card__cta {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 42px;
      border: none;
      border-radius: 21px;
      background: var(--color-gold);
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      color: var(--color-bg-primary);
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    @media (max-width: 768px) {
      .deal-card__image {
        height: 200px;
      }

      .deal-card__title {
        font-size: 16px;
      }

      .deal-card__deal-price {
        font-size: 18px;
      }
    }
  `,
})
export class BundleDealCardComponent {
  imageUrl = input<string>('');
  savingsLabel = input<string>('');
  title = input.required<string>();
  description = input<string>('');
  dealPrice = input.required<string>();
  originalPrice = input<string>('');
  addToCart = output<void>();
}
