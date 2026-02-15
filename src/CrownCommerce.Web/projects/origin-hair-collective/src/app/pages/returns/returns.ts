import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from 'components';
import { ContentService } from 'api';

@Component({
  selector: 'app-returns',
  imports: [SectionHeaderComponent],
  template: `
    <section class="content-page">
      <lib-section-header label="SUPPORT" heading="Returns & Exchanges" />
      @if (body()) {
        <div class="content-page__body" [innerHTML]="body()"></div>
      } @else {
        <p class="content-page__loading">Loading...</p>
      }
    </section>
  `,
  styles: `
    .content-page { display: flex; flex-direction: column; align-items: center; gap: 32px; padding: 60px 80px; max-width: 800px; margin: 0 auto; }
    .content-page__body { font-family: var(--font-body); font-size: 16px; line-height: 1.8; color: var(--color-text-secondary); width: 100%; }
    .content-page__loading { font-family: var(--font-body); font-size: 16px; color: var(--color-text-muted); }
    @media (max-width: 768px) { .content-page { padding: 40px 24px; } }
  `,
})
export class ReturnsPage implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly body = signal('');

  ngOnInit(): void {
    this.contentService.getPage('returns-policy').subscribe({
      next: (page) => this.body.set(page.body),
      error: () => this.body.set('<p>Returns policy is currently unavailable.</p>'),
    });
  }
}
