import { Component, model, input } from '@angular/core';

@Component({
  selector: 'lib-quantity-selector',
  template: `
    <div class="qty-selector">
      <button
        class="qty-selector__btn qty-selector__btn--minus"
        (click)="decrement()"
        [disabled]="value() <= min()"
      >
        −
      </button>
      <span class="qty-selector__value">{{ value() }}</span>
      <button
        class="qty-selector__btn qty-selector__btn--plus"
        (click)="increment()"
        [disabled]="value() >= max()"
      >
        +
      </button>
    </div>
  `,
  styles: `
    .qty-selector {
      display: flex;
      align-items: center;
    }

    .qty-selector__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--color-bg-card);
      border: none;
      font-family: var(--font-body);
      font-size: 20px;
      color: var(--color-text-primary);
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.7;
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &--minus {
        border-radius: 8px 0 0 8px;
      }

      &--plus {
        border-radius: 0 8px 8px 0;
      }
    }

    .qty-selector__value {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 48px;
      background: var(--color-bg-card);
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    @media (max-width: 768px) {
      .qty-selector__btn {
        width: 40px;
        height: 40px;
      }

      .qty-selector__value {
        width: 52px;
        height: 40px;
        font-size: 14px;
      }
    }
  `,
})
export class QuantitySelectorComponent {
  value = model<number>(1);
  min = input<number>(1);
  max = input<number>(99);

  increment() {
    if (this.value() < this.max()) {
      this.value.update((v) => v + 1);
    }
  }

  decrement() {
    if (this.value() > this.min()) {
      this.value.update((v) => v - 1);
    }
  }
}
