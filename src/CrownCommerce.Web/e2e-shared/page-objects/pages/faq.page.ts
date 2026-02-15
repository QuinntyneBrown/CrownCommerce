import { type Locator, type Page } from '@playwright/test';

export class FaqPagePOM {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly categories: Locator;
  readonly items: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-faq-page');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.categories = this.root.locator('.faq__category');
    this.items = this.root.locator('.faq__item');
  }

  async goto(): Promise<void> {
    await this.page.goto('/faq');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCategoryCount(): Promise<number> {
    return this.categories.count();
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async toggleItem(index: number): Promise<void> {
    await this.items.nth(index).locator('.faq__question').click();
  }

  async isItemExpanded(index: number): Promise<boolean> {
    const item = this.items.nth(index);
    return item.evaluate((el) => el.classList.contains('expanded'));
  }

  async getItemQuestion(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.faq__question').textContent();
  }

  async getItemAnswer(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.faq__answer').textContent();
  }
}
