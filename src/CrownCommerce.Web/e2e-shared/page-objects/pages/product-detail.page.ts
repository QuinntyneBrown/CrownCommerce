import { type Locator, type Page } from '@playwright/test';

export class ProductDetailPagePOM {
  readonly root: Locator;
  readonly breadcrumb: Locator;
  readonly imageGallery: Locator;
  readonly productName: Locator;
  readonly starRating: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly lengthSelector: Locator;
  readonly quantitySelector: Locator;
  readonly addToCartButton: Locator;
  readonly features: Locator;
  readonly reviewsSection: Locator;
  readonly reviewCards: Locator;
  readonly reviewsLink: Locator;
  readonly relatedSection: Locator;
  readonly relatedProducts: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-product-detail-page');
    this.breadcrumb = this.root.locator('lib-breadcrumb');
    this.imageGallery = this.root.locator('lib-image-gallery');
    this.productName = this.root.locator('.product-detail__name');
    this.starRating = this.root.locator('lib-star-rating');
    this.productPrice = this.root.locator('.product-detail__price');
    this.productDescription = this.root.locator('.product-detail__description');
    this.lengthSelector = this.root.locator('lib-length-selector');
    this.quantitySelector = this.root.locator('lib-quantity-selector');
    this.addToCartButton = this.root.locator('.product-detail__info lib-button');
    this.features = this.root.locator('.product-detail__features lib-checklist-item');
    this.reviewsSection = this.root.locator('.product-detail__reviews');
    this.reviewCards = this.root.locator('.product-detail__reviews-grid lib-review-card');
    this.reviewsLink = this.root.locator('.product-detail__reviews-link');
    this.relatedSection = this.root.locator('.product-detail__related');
    this.relatedProducts = this.root.locator('.product-detail__related-grid lib-product-card');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
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

  async getFeatureCount(): Promise<number> {
    return this.features.count();
  }

  async getReviewCount(): Promise<number> {
    return this.reviewCards.count();
  }

  async getRelatedProductCount(): Promise<number> {
    return this.relatedProducts.count();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
