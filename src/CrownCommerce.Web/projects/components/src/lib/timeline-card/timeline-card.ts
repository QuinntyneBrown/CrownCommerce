import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-timeline-card',
  template: `
    <article class="timeline-card">
      <span class="timeline-card__year">{{ year() }}</span>
      <h3 class="timeline-card__title">{{ title() }}</h3>
      <p class="timeline-card__description">{{ description() }}</p>
    </article>
  `,
  styles: `
    .timeline-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 28px 32px;
      border-radius: 16px;
      border: 1px solid var(--color-border);
    }

    .timeline-card__year {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 700;
      color: var(--color-gold);
    }

    .timeline-card__title {
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .timeline-card__description {
      font-family: var(--font-body);
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 0;
    }

    @media (max-width: 768px) {
      .timeline-card {
        padding: 24px;
      }

      .timeline-card__title {
        font-size: 18px;
      }
    }
  `,
})
export class TimelineCardComponent {
  year = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
