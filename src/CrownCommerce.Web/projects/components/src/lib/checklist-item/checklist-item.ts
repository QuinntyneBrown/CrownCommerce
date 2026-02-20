import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-checklist-item',
  imports: [NgClass],
  template: `
    <div class="checklist-item">
      <span class="checklist-item__icon" [ngClass]="'checklist-item__icon--' + iconColor()">
        {{ icon() === 'check' ? '✓' : '✕' }}
      </span>
      <span class="checklist-item__text">{{ text() }}</span>
    </div>
  `,
  styles: `
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .checklist-item__icon {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: normal;
      flex-shrink: 0;

      &--green {
        color: #4ADE80;
      }

      &--gold {
        color: var(--color-gold);
      }

      &--red {
        color: #F87171;
      }
    }

    .checklist-item__text {
      font-family: var(--font-body);
      font-size: 15px;
      color: var(--color-text-secondary);
    }

    @media (max-width: 768px) {
      .checklist-item__text {
        font-size: 14px;
      }
    }
  `,
})
export class ChecklistItemComponent {
  text = input.required<string>();
  icon = input<'check' | 'x'>('check');
  iconColor = input<'green' | 'gold' | 'red'>('gold');
}
