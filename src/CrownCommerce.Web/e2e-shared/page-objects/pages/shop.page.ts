import { type Locator, type Page } from '@playwright/test';
import { ProductGridPOM } from '../components/product-grid.component';

export class ShopPagePOM {
  readonly root: Locator;
  readonly filterGroups: Locator;
  readonly filterButtons: Locator;
  readonly sortSelect: Locator;
  readonly statusMessage: Locator;
  readonly errorState: Locator;
  readonly grid: ProductGridPOM;

  constructor(private page: Page) {
    this.root = page.locator('feat-shop-page');
    this.filterGroups = this.root.locator('.shop__filter-group');
    this.filterButtons = this.root.locator('.shop__filter-btn');
    this.sortSelect = this.root.locator('.shop__sort');
    this.statusMessage = this.root.locator('.shop__status');
    this.errorState = this.root.locator('.shop__status--error');
    this.grid = new ProductGridPOM(page, this.root);
  }

  async goto(path = '/shop'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterBy(label: string): Promise<void> {
    await this.filterButtons.filter({ hasText: label }).click();
  }

  async sortBy(value: string): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async getActiveFilterTexts(): Promise<string[]> {
    return this.filterButtons.filter({ has: this.page.locator('.active') }).allTextContents();
  }
}
