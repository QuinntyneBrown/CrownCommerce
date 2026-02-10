import { Component, input } from '@angular/core';

export interface FooterLink {
  label: string;
  href: string;
}

@Component({
  selector: 'lib-footer-link-column',
  template: `
    <nav class="footer-links">
      <h4 class="footer-links__title">{{ title() }}</h4>
      @for (link of links(); track link.label) {
        <a class="footer-links__link" [href]="link.href">{{ link.label }}</a>
      }
    </nav>
  `,
  styles: `
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .footer-links__title {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #faf7f0;
      margin: 0;
    }

    .footer-links__link {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: #6b6860;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #9a9590;
      }
    }

    @media (max-width: 768px) {
      .footer-links {
        gap: 12px;
      }

      .footer-links__title {
        font-size: 12px;
      }

      .footer-links__link {
        font-size: 12px;
      }
    }
  `,
})
export class FooterLinkColumnComponent {
  title = input.required<string>();
  links = input.required<FooterLink[]>();
}
