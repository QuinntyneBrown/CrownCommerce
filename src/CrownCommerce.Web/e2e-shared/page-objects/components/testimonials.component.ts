import { type Locator, type Page } from '@playwright/test';

export class TestimonialsPOM {
  readonly root: Locator;
  readonly cards: Locator;
  readonly emptyState: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-testimonials');
    this.cards = this.root.locator('lib-testimonial-card');
    this.emptyState = this.root.locator('.testimonials__empty');
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
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

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }
}
