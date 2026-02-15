import { type Locator, type Page } from '@playwright/test';

export class FaqListPOM {
  readonly root: Locator;
  readonly categories: Locator;
  readonly items: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-faq-list');
    this.categories = this.root.locator('.faq-list__category');
    this.items = this.root.locator('.faq-list__item');
  }

  async getCategoryCount(): Promise<number> {
    return this.categories.count();
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async toggleItem(index: number): Promise<void> {
    await this.items.nth(index).locator('.faq-list__question').click();
  }

  async isItemExpanded(index: number): Promise<boolean> {
    const item = this.items.nth(index);
    const hasExpandedClass = await item.evaluate((el) => el.classList.contains('expanded'));
    return hasExpandedClass;
  }

  async getItemQuestion(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.faq-list__question').textContent();
  }

  async getItemAnswer(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.faq-list__answer').textContent();
  }
}
