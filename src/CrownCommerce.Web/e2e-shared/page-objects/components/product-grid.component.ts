import { type Locator, type Page } from '@playwright/test';

export interface ProductCardInfo {
  tag: string | null;
  title: string | null;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
}

export class ProductGridPOM {
  readonly root: Locator;
  readonly grid: Locator;
  readonly cards: Locator;
  readonly statusMessage: Locator;
  readonly errorState: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-product-grid');
    this.grid = this.root.locator('.product-grid__grid');
    this.cards = this.grid.locator('lib-product-card');
    this.statusMessage = this.root.locator('.product-grid__status');
    this.errorState = this.root.locator('.product-grid__status--error');
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
  }

  async getCardInfo(index: number): Promise<ProductCardInfo> {
    const card = this.cards.nth(index);
    return {
      tag: await card.locator('.product-card__tag').textContent().catch(() => null),
      title: await card.locator('.product-card__title').textContent(),
      description: await card.locator('.product-card__description').textContent(),
      price: await card.locator('.product-card__price').textContent(),
      imageUrl: await card.locator('.product-card__image img').getAttribute('src'),
    };
  }

  async clickCard(index: number): Promise<void> {
    await this.cards.nth(index).click();
  }

  async isLoading(): Promise<boolean> {
    const status = await this.statusMessage.textContent().catch(() => null);
    return status !== null && !status.includes('error');
  }

  async hasError(): Promise<boolean> {
    return this.errorState.isVisible();
  }
}
