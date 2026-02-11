import { Component, output } from '@angular/core';

@Component({
  selector: 'lib-close-button',
  template: `
    <button class="close-btn" aria-label="Close" (click)="closed.emit()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  `,
  styles: `
    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 100px;
      border: 1px solid rgba(201, 160, 82, 0.19);
      background: transparent;
      color: #faf7f0;
      cursor: pointer;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: rgba(201, 160, 82, 0.4);
      }
    }
  `,
})
export class CloseButtonComponent {
  closed = output();
}
