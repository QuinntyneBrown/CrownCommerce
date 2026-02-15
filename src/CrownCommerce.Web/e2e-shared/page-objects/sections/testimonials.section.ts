import { type Locator, type Page } from '@playwright/test';

export class TestimonialsSectionPOM {
  readonly root: Locator;
  readonly sectionLabel: Locator;
  readonly cards: Locator;
  readonly quoteIcon: Locator;
  readonly quote: Locator;
  readonly stars: Locator;
  readonly authorName: Locator;
  readonly loadingSpinner: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.testimonials');
    this.sectionLabel = this.root.locator('.section-label');
    this.cards = this.root.locator('lib-testimonial-card');
    // First-card shortcuts (backward compat with OHC tests)
    this.quoteIcon = this.cards.first().locator('.testimonial-card__quote-icon');
    this.quote = this.cards.first().locator('.testimonial-card__quote');
    this.stars = this.cards.first().locator('.testimonial-card__stars');
    this.authorName = this.cards.first().locator('.testimonial-card__name');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
  }

  /** Alias for `cards` (Mane Haus compat) */
  get testimonialCards(): Locator {
    return this.cards;
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
  }

  /** Alias for `getCardCount()` (Mane Haus compat) */
  async getTestimonialCount(): Promise<number> {
    return this.getCardCount();
  }

  async getLabelText(): Promise<string | null> {
    return this.sectionLabel.textContent();
  }

  async getQuoteText(index = 0): Promise<string | null> {
    return this.cards.nth(index).locator('.testimonial-card__quote').textContent();
  }

  async getAuthorText(index = 0): Promise<string | null> {
    return this.cards.nth(index).locator('.testimonial-card__name').textContent();
  }

  async getStarsText(index = 0): Promise<string | null> {
    return this.cards.nth(index).locator('.testimonial-card__stars').textContent();
  }

  async hasQuoteIcon(index = 0): Promise<boolean> {
    return this.cards.nth(index).locator('.testimonial-card__quote-icon').isVisible();
  }
}
