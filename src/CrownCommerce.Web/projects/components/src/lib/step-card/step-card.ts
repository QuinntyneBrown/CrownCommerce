import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-step-card',
  imports: [NgClass],
  template: `
    <article class="step-card" [ngClass]="'step-card--' + variant()">
      @if (variant() === 'badge') {
        <span class="step-card__badge">{{ stepNumber() }}</span>
      } @else {
        <span class="step-card__number">{{ paddedNumber() }}</span>
      }
      <h3 class="step-card__title">{{ title() }}</h3>
      <p class="step-card__description">{{ description() }}</p>
    </article>
  `,
  styles: `
    .step-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step-card--badge {
      padding: 28px;
      border-radius: 16px;
      background: var(--color-bg-card);
    }

    .step-card__badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 100px;
      background: var(--color-gold);
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 700;
      color: var(--color-bg-primary);
    }

    .step-card__number {
      font-family: var(--font-heading);
      font-size: 48px;
      font-weight: 300;
      color: var(--color-gold);
    }

    .step-card__title {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 300;
      color: var(--color-text-primary);
      margin: 0;
    }

    .step-card--badge .step-card__title {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 600;
    }

    .step-card__description {
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .step-card--badge .step-card__description {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .step-card--badge {
        padding: 24px;
      }

      .step-card__number {
        font-size: 36px;
      }

      .step-card__title {
        font-size: 20px;
      }

      .step-card--badge .step-card__title {
        font-size: 15px;
      }
    }
  `,
})
export class StepCardComponent {
  stepNumber = input.required<number>();
  title = input.required<string>();
  description = input.required<string>();
  variant = input<'badge' | 'large'>('badge');

  get paddedNumber(): string {
    return String(this.stepNumber()).padStart(2, '0');
  }
}
