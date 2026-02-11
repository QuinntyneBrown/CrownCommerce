import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-trust-bar-item',
  template: `
    <div class="trust-item">
      <span class="trust-item__icon" [innerHTML]="safeIcon()"></span>
      <span class="trust-item__text">{{ text() }}</span>
    </div>
  `,
  styles: `
    .trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .trust-item__icon {
      display: flex;
      align-items: center;
      color: #c9a052;
    }

    :host ::ng-deep .trust-item__icon svg {
      width: 16px;
      height: 16px;
    }

    .trust-item__text {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #9a9590;
    }

    @media (max-width: 768px) {
      .trust-item__text {
        font-size: 11px;
        letter-spacing: 0.5px;
      }

      :host ::ng-deep .trust-item__icon svg {
        width: 14px;
        height: 14px;
      }
    }
  `,
})
export class TrustBarItemComponent {
  private sanitizer = inject(DomSanitizer);

  text = input.required<string>();
  iconSvg = input.required<string>();

  safeIcon = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.iconSvg()));
}
