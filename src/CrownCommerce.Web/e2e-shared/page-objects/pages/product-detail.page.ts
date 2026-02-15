import { type Locator, type Page } from '@playwright/test';

export class ProductDetailPagePOM {
  readonly root: Locator;
  readonly loadingState: Locator;
  readonly errorState: Locator;
  readonly productImage: Locator;
  readonly productType: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly metaItems: Locator;
  readonly quantityValue: Locator;
  readonly quantityIncrement: Locator;
  readonly quantityDecrement: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartButton: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-product-detail-page');
    this.loadingState = this.root.locator('.product-detail__loading');
    this.errorState = this.root.locator('.product-detail__error');
    this.productImage = this.root.locator('.product-detail__image img');
    this.productType = this.root.locator('.product-detail__type');
    this.productName = this.root.locator('.product-detail__name');
    this.productPrice = this.root.locator('.product-detail__price');
    this.productDescription = this.root.locator('.product-detail__description');
    this.metaItems = this.root.locator('.product-detail__meta-item');
    this.quantityValue = this.root.locator('.product-detail__qty-value');
    this.quantityIncrement = this.root.locator('.product-detail__qty-btn').last();
    this.quantityDecrement = this.root.locator('.product-detail__qty-btn').first();
    this.addToCartButton = this.root.locator('.product-detail__actions lib-button button');
    this.viewCartButton = this.root.locator('.product-detail__view-cart');
  }

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductName(): Promise<string | null> {
    return this.productName.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return this.productPrice.textContent();
  }

  async getQuantity(): Promise<string | null> {
    return this.quantityValue.textContent();
  }

  async incrementQuantity(): Promise<void> {
    await this.quantityIncrement.click();
  }

  async decrementQuantity(): Promise<void> {
    await this.quantityDecrement.click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async getMetaValue(label: string): Promise<string | null> {
    const item = this.metaItems.filter({ has: this.page.locator(`.product-detail__meta-label:has-text("${label}")`) });
    return item.locator('.product-detail__meta-value').textContent();
  }
}
