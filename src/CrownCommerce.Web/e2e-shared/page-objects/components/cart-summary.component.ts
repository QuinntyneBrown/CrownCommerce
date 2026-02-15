import { type Locator, type Page } from '@playwright/test';

export class CartSummaryPOM {
  readonly root: Locator;
  readonly statusMessage: Locator;
  readonly items: Locator;
  readonly total: Locator;
  readonly footer: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-cart-summary');
    this.statusMessage = this.root.locator('.cart-summary__status');
    this.items = this.root.locator('.cart-summary__item');
    this.total = this.root.locator('.cart-summary__total');
    this.footer = this.root.locator('.cart-summary__footer');
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async getItemName(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.cart-summary__item-name').textContent();
  }

  async getItemQuantity(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.cart-summary__item-qty').textContent();
  }

  async getItemTotal(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.cart-summary__item-total').textContent();
  }

  async removeItem(index: number): Promise<void> {
    await this.items.nth(index).locator('.cart-summary__remove').click();
  }

  async getTotalText(): Promise<string | null> {
    return this.total.textContent();
  }
}
