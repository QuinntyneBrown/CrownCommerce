import { type Locator, type Page } from '@playwright/test';

export class ShopPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroDescription: Locator;
  readonly sidebar: Locator;
  readonly sidebarTitle: Locator;
  readonly filterGroups: Locator;
  readonly filterItems: Locator;
  readonly sortBar: Locator;
  readonly productCount: Locator;
  readonly sortSelect: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly statusMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-shop-page');
    this.heroLabel = this.root.locator('.shop-hero__label');
    this.heroTitle = this.root.locator('.shop-hero__title');
    this.heroDescription = this.root.locator('.shop-hero__description');
    this.sidebar = this.root.locator('.shop__sidebar');
    this.sidebarTitle = this.root.locator('.shop__sidebar-title');
    this.filterGroups = this.root.locator('.shop__filter-group');
    this.filterItems = this.root.locator('.shop__filter-item');
    this.sortBar = this.root.locator('.shop__sort-bar');
    this.productCount = this.root.locator('.shop__count');
    this.sortSelect = this.root.locator('.shop__sort');
    this.productGrid = this.root.locator('.shop__grid');
    this.productCards = this.root.locator('.shop__grid lib-product-card');
    this.statusMessage = this.root.locator('.shop__status');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(path = '/shop'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterBy(label: string): Promise<void> {
    await this.filterItems.filter({ hasText: label }).first().click();
  }

  async sortBy(value: string): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getProductCountText(): Promise<string | null> {
    return this.productCount.textContent();
  }

  async getFilterGroupCount(): Promise<number> {
    return this.filterGroups.count();
  }
}
