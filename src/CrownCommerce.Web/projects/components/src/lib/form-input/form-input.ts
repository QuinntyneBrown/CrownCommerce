import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-form-input',
  imports: [FormsModule, NgClass],
  template: `
    <div class="form-input" [ngClass]="'form-input--' + variant()">
      <label class="form-input__label">{{ label() }}</label>
      <input
        class="form-input__field"
        [type]="type()"
        [placeholder]="placeholder()"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
      />
    </div>
  `,
  styles: `
    .form-input {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .form-input__label {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .form-input__field {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-primary);
      border: none;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }

    .form-input--filled .form-input__field {
      height: 48px;
      padding: 0 16px;
      border-radius: 10px;
      background: var(--color-bg-primary);

      &::placeholder {
        color: var(--color-text-muted);
      }
    }

    .form-input--outlined .form-input__field {
      height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--color-border);

      &::placeholder {
        color: var(--color-text-muted);
      }
    }

    @media (max-width: 768px) {
      .form-input--filled .form-input__field {
        height: 44px;
      }

      .form-input--outlined .form-input__field {
        height: 40px;
      }
    }
  `,
})
export class FormInputComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'tel'>('text');
  variant = input<'filled' | 'outlined'>('filled');
  value = model<string>('');
}
