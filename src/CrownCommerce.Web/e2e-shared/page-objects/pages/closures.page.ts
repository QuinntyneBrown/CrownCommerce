import { type Locator, type Page } from '@playwright/test';

export class ClosuresPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly filterChips: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-closures-page');
    this.heroLabel = this.root.locator('.category-page__label');
    this.heroTitle = this.root.locator('.category-page__title');
    this.heroSubtitle = this.root.locator('.category-page__subtitle');
    this.filterChips = this.root.locator('.category-page__filters lib-filter-chip');
    this.productGrid = this.root.locator('.category-page__grid');
    this.productCards = this.root.locator('.category-page__grid lib-product-card');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/closures');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getFilterChipCount(): Promise<number> {
    return this.filterChips.count();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async filterBy(label: string): Promise<void> {
    await this.filterChips.filter({ hasText: label }).click();
  }
}
