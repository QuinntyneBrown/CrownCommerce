import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-benefit-card',
  template: `
    <article class="benefit-card">
      <div class="benefit-card__icon-wrap">
        <span class="benefit-card__icon" [innerHTML]="iconSvg()"></span>
      </div>
      <h3 class="benefit-card__title">{{ title() }}</h3>
      <p class="benefit-card__description">{{ description() }}</p>
    </article>
  `,
  styles: `
    .benefit-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 32px;
      border-radius: 16px;
      background: #1e1c18;
      border: 1px solid rgba(201, 160, 82, 0.082);
    }

    .benefit-card__icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(201, 160, 82, 0.082);
    }

    .benefit-card__icon {
      display: flex;
      align-items: center;
      color: #c9a052;

      :host ::ng-deep svg {
        width: 24px;
        height: 24px;
      }
    }

    .benefit-card__title {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 600;
      color: #faf7f0;
      margin: 0;
    }

    .benefit-card__description {
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: #9a9590;
      margin: 0;
    }

    @media (max-width: 768px) {
      .benefit-card {
        gap: 14px;
        padding: 24px;
      }

      .benefit-card__icon-wrap {
        width: 44px;
        height: 44px;
        border-radius: 12px;
      }

      .benefit-card__icon :host ::ng-deep svg {
        width: 22px;
        height: 22px;
      }

      .benefit-card__title {
        font-size: 18px;
      }

      .benefit-card__description {
        font-size: 14px;
      }
    }
  `,
})
export class BenefitCardComponent {
  iconSvg = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
