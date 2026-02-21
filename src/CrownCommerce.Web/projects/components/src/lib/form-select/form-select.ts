import { Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

export type SelectOption = string | { label: string; value: string };

@Component({
  selector: 'lib-form-select',
  imports: [FormsModule, NgClass],
  template: `
    <div class="form-select" [ngClass]="'form-select--' + variant()">
      <label class="form-select__label">{{ label() }}</label>
      <div class="form-select__wrapper">
        <select
          class="form-select__field"
          [ngModel]="value()"
          (ngModelChange)="value.set($event)"
        >
          @if (placeholder()) {
            <option value="" disabled selected>{{ placeholder() }}</option>
          }
          @for (option of normalizedOptions(); track optionValue(option)) {
            <option [value]="optionValue(option)">{{ optionLabel(option) }}</option>
          }
        </select>
        <span class="form-select__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
    </div>
  `,
  styles: `
    .form-select {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .form-select__label {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .form-select__wrapper {
      position: relative;
    }

    .form-select__field {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-primary);
      border: none;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      appearance: none;
      cursor: pointer;
    }

    .form-select--filled .form-select__field {
      height: 48px;
      padding: 0 40px 0 16px;
      border-radius: 10px;
      background: var(--color-bg-primary);
    }

    .form-select--outlined .form-select__field {
      height: 44px;
      padding: 0 40px 0 16px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--color-border);
    }

    .form-select__arrow {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      pointer-events: none;
      display: flex;
    }

    @media (max-width: 768px) {
      .form-select--filled .form-select__field {
        height: 44px;
      }

      .form-select--outlined .form-select__field {
        height: 40px;
      }
    }
  `,
})
export class FormSelectComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  variant = input<'filled' | 'outlined'>('filled');
  value = model<string>('');

  normalizedOptions = computed(() => this.options());

  optionValue(option: SelectOption): string {
    return typeof option === 'string' ? option : option.value;
  }

  optionLabel(option: SelectOption): string {
    return typeof option === 'string' ? option : option.label;
  }
}
