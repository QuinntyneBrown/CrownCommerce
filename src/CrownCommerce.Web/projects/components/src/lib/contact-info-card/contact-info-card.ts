import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-contact-info-card',
  template: `
    <article class="info-card">
      <span class="info-card__icon" [innerHTML]="safeIcon()"></span>
      <h3 class="info-card__title">{{ title() }}</h3>
      <p class="info-card__description">{{ description() }}</p>
    </article>
  `,
  styles: `
    .info-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px;
      border-radius: 16px;
      background: var(--color-bg-card);
    }

    .info-card__icon {
      display: flex;
      color: var(--color-gold);
    }

    :host ::ng-deep .info-card__icon svg {
      width: 28px;
      height: 28px;
    }

    .info-card__title {
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 300;
      color: var(--color-text-primary);
      margin: 0;
    }

    .info-card__description {
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--color-text-secondary);
      text-align: center;
      white-space: pre-line;
      margin: 0;
    }

    @media (max-width: 768px) {
      .info-card {
        padding: 24px;
      }

      .info-card__title {
        font-size: 18px;
      }
    }
  `,
})
export class ContactInfoCardComponent {
  private sanitizer = inject(DomSanitizer);

  iconSvg = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();

  safeIcon = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.iconSvg()));
}
