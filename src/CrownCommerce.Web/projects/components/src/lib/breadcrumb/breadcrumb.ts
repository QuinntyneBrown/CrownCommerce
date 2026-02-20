import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-breadcrumb',
  template: `
    <nav class="breadcrumb">
      @for (item of items(); track item; let last = $last) {
        <span class="breadcrumb__item">{{ item }}</span>
        @if (!last) {
          <span class="breadcrumb__separator">/</span>
        }
      }
    </nav>
  `,
  styles: `
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .breadcrumb__item {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--color-text-muted);
    }

    .breadcrumb__separator {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--color-text-muted);
    }

    @media (max-width: 768px) {
      .breadcrumb__item,
      .breadcrumb__separator {
        font-size: 12px;
      }
    }
  `,
})
export class BreadcrumbComponent {
  items = input.required<string[]>();
}
