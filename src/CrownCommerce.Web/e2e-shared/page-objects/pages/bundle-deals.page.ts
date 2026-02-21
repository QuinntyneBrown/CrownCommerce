import { type Locator, type Page } from '@playwright/test';

export class BundleDealsPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly savingsBadge: Locator;
  readonly dealGrid: Locator;
  readonly dealCards: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-bundle-deals-page');
    this.heroLabel = this.root.locator('.bundle-deals__label');
    this.heroTitle = this.root.locator('.bundle-deals__title');
    this.heroSubtitle = this.root.locator('.bundle-deals__subtitle');
    this.savingsBadge = this.root.locator('.bundle-deals__badge');
    this.dealGrid = this.root.locator('.bundle-deals__grid');
    this.dealCards = this.root.locator('.bundle-deals__grid lib-bundle-deal-card');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/bundle-deals');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getDealCardCount(): Promise<number> {
    return this.dealCards.count();
  }
}
