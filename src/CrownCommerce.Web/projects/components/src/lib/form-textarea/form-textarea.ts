import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-form-textarea',
  imports: [FormsModule, NgClass],
  template: `
    <div class="form-textarea" [ngClass]="'form-textarea--' + variant()">
      <label class="form-textarea__label">{{ label() }}</label>
      <textarea
        class="form-textarea__field"
        [placeholder]="placeholder()"
        [rows]="rows()"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
      ></textarea>
    </div>
  `,
  styles: `
    .form-textarea {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .form-textarea__label {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }

    .form-textarea__field {
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--color-text-primary);
      border: none;
      outline: none;
      resize: vertical;
      width: 100%;
      box-sizing: border-box;
    }

    .form-textarea--filled .form-textarea__field {
      padding: 16px;
      border-radius: 10px;
      background: var(--color-bg-primary);

      &::placeholder {
        color: var(--color-text-muted);
      }
    }

    .form-textarea--outlined .form-textarea__field {
      padding: 12px 16px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--color-border);

      &::placeholder {
        color: var(--color-text-muted);
      }
    }

    @media (max-width: 768px) {
      .form-textarea__field {
        font-size: 13px;
      }
    }
  `,
})
export class FormTextareaComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  rows = input<number>(5);
  variant = input<'filled' | 'outlined'>('filled');
  value = model<string>('');
}
