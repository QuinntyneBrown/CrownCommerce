import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'lib-accordion-item',
  template: `
    <div class="accordion-item" (click)="toggle()">
      <div class="accordion-item__header">
        <span class="accordion-item__question">{{ question() }}</span>
        <span class="accordion-item__toggle">{{ isExpanded() ? '−' : '+' }}</span>
      </div>
      @if (isExpanded()) {
        <p class="accordion-item__answer">{{ answer() }}</p>
      }
    </div>
  `,
  styles: `
    .accordion-item {
      padding: 24px;
      border-radius: 12px;
      background: var(--color-bg-card);
      cursor: pointer;
    }

    .accordion-item__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .accordion-item__question {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .accordion-item__toggle {
      font-family: var(--font-body);
      font-size: 22px;
      color: var(--color-gold);
      flex-shrink: 0;
    }

    .accordion-item__answer {
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin: 12px 0 0;
    }

    @media (max-width: 768px) {
      .accordion-item {
        padding: 20px;
      }

      .accordion-item__question {
        font-size: 15px;
      }

      .accordion-item__answer {
        font-size: 14px;
      }
    }
  `,
})
export class AccordionItemComponent {
  question = input.required<string>();
  answer = input.required<string>();
  expanded = input<boolean>(false);

  isExpanded = signal(false);

  ngOnInit() {
    this.isExpanded.set(this.expanded());
  }

  toggle() {
    this.isExpanded.update((v) => !v);
  }
}
