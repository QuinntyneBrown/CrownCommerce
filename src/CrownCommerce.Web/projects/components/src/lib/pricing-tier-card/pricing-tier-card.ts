import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-pricing-tier-card',
  imports: [NgClass],
  template: `
    <article class="tier-card" [ngClass]="{ 'tier-card--highlighted': highlighted() }">
      @if (popularLabel()) {
        <span class="tier-card__badge">{{ popularLabel() }}</span>
      }
      <h3 class="tier-card__name">{{ tierName() }}</h3>
      <p class="tier-card__volume">{{ volume() }}</p>
      <span class="tier-card__discount">{{ discount() }}</span>
    </article>
  `,
  styles: `
    .tier-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 32px;
      border-radius: 16px;
      border: 1px solid var(--color-gold-border);
    }

    .tier-card--highlighted {
      background: rgba(201, 160, 82, 0.06);
      border-color: var(--color-gold);
    }

    .tier-card__badge {
      align-self: flex-start;
      font-family: var(--font-body);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--color-bg-primary);
      background: var(--color-gold);
      padding: 4px 14px;
      border-radius: 100px;
      text-transform: uppercase;
    }

    .tier-card__name {
      font-family: var(--font-heading);
      font-size: 24px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .tier-card__volume {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .tier-card__discount {
      font-family: var(--font-body);
      font-size: 20px;
      font-weight: 700;
      color: var(--color-gold);
    }

    @media (max-width: 768px) {
      .tier-card {
        padding: 24px;
      }

      .tier-card__name {
        font-size: 20px;
      }

      .tier-card__discount {
        font-size: 18px;
      }
    }
  `,
})
export class PricingTierCardComponent {
  tierName = input.required<string>();
  volume = input.required<string>();
  discount = input.required<string>();
  highlighted = input<boolean>(false);
  popularLabel = input<string>('');
}
