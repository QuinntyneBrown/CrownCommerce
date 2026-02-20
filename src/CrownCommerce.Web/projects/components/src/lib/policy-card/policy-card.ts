import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-policy-card',
  template: `
    <article class="policy-card">
      <h3 class="policy-card__title">{{ title() }}</h3>
      <p class="policy-card__description">{{ description() }}</p>
    </article>
  `,
  styles: `
    .policy-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 32px;
      border-radius: 16px;
      background: var(--color-bg-card);
    }

    .policy-card__title {
      font-family: var(--font-body);
      font-size: 17px;
      font-weight: 500;
      color: var(--color-text-primary);
      margin: 0;
    }

    .policy-card__description {
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 0;
    }

    @media (max-width: 768px) {
      .policy-card {
        padding: 24px;
      }

      .policy-card__title {
        font-size: 16px;
      }

      .policy-card__description {
        font-size: 14px;
      }
    }
  `,
})
export class PolicyCardComponent {
  title = input.required<string>();
  description = input.required<string>();
}
