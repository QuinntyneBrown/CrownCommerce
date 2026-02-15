import { type Locator, type Page } from '@playwright/test';

export class FinalCtaSection {
  readonly root: Locator;
  readonly heading: Locator;
  readonly subline: Locator;
  readonly shopNowButton: Locator;
  readonly trustText: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.final-cta');
    this.heading = this.root.locator('.final-cta__heading');
    this.subline = this.root.locator('.final-cta__sub');
    this.shopNowButton = this.root.locator('lib-button button');
    this.trustText = this.root.locator('.final-cta__trust');
  }

  async getHeadingText(): Promise<string | null> {
    return this.heading.textContent();
  }

  async getSublineText(): Promise<string | null> {
    return this.subline.textContent();
  }

  async getTrustText(): Promise<string | null> {
    return this.trustText.textContent();
  }
}
