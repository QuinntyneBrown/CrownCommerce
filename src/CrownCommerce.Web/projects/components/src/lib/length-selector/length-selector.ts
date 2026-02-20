import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-length-selector',
  imports: [NgClass],
  template: `
    <div class="length-selector">
      @for (length of lengths(); track length) {
        <button
          class="length-selector__option"
          [ngClass]="{ 'length-selector__option--selected': length === selectedLength() }"
          (click)="lengthChange.emit(length)"
        >
          {{ length }}
        </button>
      }
    </div>
  `,
  styles: `
    .length-selector {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .length-selector__option {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 44px;
      border-radius: 8px;
      border: none;
      background: var(--color-bg-card);
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-primary);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.8;
      }

      &--selected {
        background: var(--color-gold);
        color: var(--color-bg-primary);
        font-weight: 600;
      }
    }

    @media (max-width: 768px) {
      .length-selector__option {
        width: 56px;
        height: 40px;
        font-size: 13px;
      }
    }
  `,
})
export class LengthSelectorComponent {
  lengths = input.required<string[]>();
  selectedLength = input<string>('');
  lengthChange = output<string>();
}
