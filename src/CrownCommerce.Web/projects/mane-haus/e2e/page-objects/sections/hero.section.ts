import { type Locator, type Page } from '@playwright/test';

export class HeroSection {
  readonly root: Locator;
  readonly badge: Locator;
  readonly headline: Locator;
  readonly subline: Locator;
  readonly ctaRow: Locator;
  readonly shopNowButton: Locator;
  readonly ourStoryButton: Locator;
  readonly heroImage: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.hero');
    this.badge = this.root.locator('lib-badge');
    this.headline = this.root.locator('h1.hero__headline');
    this.subline = this.root.locator('p.hero__subline');
    this.ctaRow = this.root.locator('.hero__cta-row');
    this.shopNowButton = this.ctaRow.locator('lib-button').first().locator('button');
    this.ourStoryButton = this.ctaRow.locator('lib-button').nth(1).locator('button');
    this.heroImage = this.root.locator('.hero__image');
  }

  async getHeadlineText(): Promise<string | null> {
    return this.headline.textContent();
  }

  async getSublineText(): Promise<string | null> {
    return this.subline.textContent();
  }

  async clickShopNow(): Promise<void> {
    await this.shopNowButton.click();
  }

  async clickOurStory(): Promise<void> {
    await this.ourStoryButton.click();
  }

  async hasArrowOnShopButton(): Promise<boolean> {
    return this.shopNowButton.locator('svg.btn__arrow').isVisible();
  }
}
