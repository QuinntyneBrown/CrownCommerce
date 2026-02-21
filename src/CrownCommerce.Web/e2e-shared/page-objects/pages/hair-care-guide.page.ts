import { type Locator, type Page } from '@playwright/test';

export class HairCareGuidePagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly sections: Locator;
  readonly tipCards: Locator;
  readonly ctaSection: Locator;
  readonly ctaTitle: Locator;
  readonly ctaButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-hair-care-guide-page');
    this.heroLabel = this.root.locator('.hair-care__hero .hair-care__label');
    this.heroTitle = this.root.locator('.hair-care__title');
    this.heroSubtitle = this.root.locator('.hair-care__subtitle');
    this.sections = this.root.locator('.hair-care__section');
    this.tipCards = this.root.locator('.hair-care__tips-grid lib-step-card');
    this.ctaSection = this.root.locator('.hair-care__cta');
    this.ctaTitle = this.root.locator('.hair-care__cta-title');
    this.ctaButton = this.root.locator('.hair-care__cta lib-button');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/hair-care-guide');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getSectionCount(): Promise<number> {
    return this.sections.count();
  }

  async getTipCardCount(): Promise<number> {
    return this.tipCards.count();
  }
}
