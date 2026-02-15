import { type Locator, type Page } from '@playwright/test';

export class TestimonialsSection {
  readonly root: Locator;
  readonly label: Locator;
  readonly testimonialCards: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.testimonials');
    this.label = this.root.locator('.section-label');
    this.testimonialCards = this.root.locator('lib-testimonial-card');
    this.loadingSpinner = this.root.locator('app-loading-spinner');
    this.errorState = this.root.locator('app-error-state');
  }

  async getTestimonialCount(): Promise<number> {
    return this.testimonialCards.count();
  }

  async getLabelText(): Promise<string | null> {
    return this.label.textContent();
  }
}
