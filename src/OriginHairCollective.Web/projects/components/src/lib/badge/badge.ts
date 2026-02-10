import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-badge',
  template: `
    <span class="badge">
      @if (showDot()) {
        <span class="badge__dot"></span>
      }
      <span class="badge__text">{{ text() }}</span>
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 100px;
      background: rgba(201, 160, 82, 0.125);
    }

    .badge__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #c9a052;
    }

    .badge__text {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      color: #c9a052;
      text-transform: uppercase;
    }
  `,
})
export class BadgeComponent {
  text = input.required<string>();
  showDot = input(true);
}
