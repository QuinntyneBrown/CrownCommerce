import { type Locator, type Page } from '@playwright/test';

export class CartPagePOM {
  readonly root: Locator;
  readonly title: Locator;
  readonly loadingState: Locator;
  readonly emptyState: Locator;
  readonly items: Locator;
  readonly summary: Locator;
  readonly total: Locator;
  readonly totalAmount: Locator;
  readonly actions: Locator;
  readonly checkoutButton: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-cart-page');
    this.title = this.root.locator('.cart__title');
    this.loadingState = this.root.locator('.cart__status');
    this.emptyState = this.root.locator('.cart__empty');
    this.items = this.root.locator('.cart__item');
    this.summary = this.root.locator('.cart__summary');
    this.total = this.root.locator('.cart__total');
    this.totalAmount = this.root.locator('.cart__total-amount');
    this.actions = this.root.locator('.cart__actions');
    this.checkoutButton = this.actions.locator('lib-button button').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async getItemName(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.cart__item-name').textContent();
  }

  async getItemPrice(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.cart__item-price').textContent();
  }

  async removeItem(index: number): Promise<void> {
    await this.items.nth(index).locator('.cart__item-remove').click();
  }

  async getTotalText(): Promise<string | null> {
    return this.totalAmount.textContent();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
