import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-filter-chip',
  imports: [NgClass],
  template: `
    <button
      class="filter-chip"
      [ngClass]="{ 'filter-chip--selected': selected() }"
      (click)="selectedChange.emit()"
    >
      {{ label() }}
    </button>
  `,
  styles: `
    .filter-chip {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: normal;
      color: var(--color-text-secondary);
      background: var(--color-bg-card);
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        opacity: 0.8;
      }

      &--selected {
        font-weight: 600;
        color: var(--color-bg-primary);
        background: var(--color-gold);
      }
    }
  `,
})
export class FilterChipComponent {
  label = input.required<string>();
  selected = input<boolean>(false);
  selectedChange = output<void>();
}
