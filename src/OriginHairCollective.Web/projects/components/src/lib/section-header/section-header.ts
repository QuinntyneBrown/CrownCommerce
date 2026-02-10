import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-section-header',
  template: `
    <div class="section-header">
      <span class="section-header__label">{{ label() }}</span>
      <h2 class="section-header__heading">{{ heading() }}</h2>
    </div>
  `,
  styles: `
    .section-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .section-header__label {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 3px;
      color: #c9a052;
      text-transform: uppercase;
    }

    .section-header__heading {
      font-family: 'Fraunces', serif;
      font-size: 42px;
      font-weight: 500;
      letter-spacing: -0.8px;
      color: #faf7f0;
      text-align: center;
      margin: 0;
    }

    @media (max-width: 768px) {
      .section-header__heading {
        font-size: 28px;
        letter-spacing: -0.5px;
      }

      .section-header__label {
        font-size: 11px;
      }
    }
  `,
})
export class SectionHeaderComponent {
  label = input.required<string>();
  heading = input.required<string>();
}
