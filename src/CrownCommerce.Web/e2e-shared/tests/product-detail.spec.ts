import { test, expect } from '@playwright/test';
import { ProductDetailPagePOM } from '../page-objects/pages/product-detail.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProductDetail, mockProductReviews, mockRelatedProducts } from '../fixtures/mock-data';

test.describe('ProductDetailPage (feat-product-detail-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('displays product name and price', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.productName).toBeVisible();
    expect(await detail.getProductName()).toContain(mockProductDetail.name);
    expect(await detail.getProductPrice()).toContain('85');
  });

  test('displays breadcrumb navigation', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.breadcrumb).toBeVisible();
  });

  test('displays image gallery', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.imageGallery).toBeVisible();
  });

  test('displays star rating', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.starRating).toBeVisible();
  });

  test('shows product description', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.productDescription).toBeVisible();
    await expect(detail.productDescription).toContainText(mockProductDetail.description);
  });

  test('shows length selector for products with lengths', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.lengthSelector).toBeVisible();
  });

  test('shows quantity selector', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.quantitySelector).toBeVisible();
  });

  test('has add to cart button', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.addToCartButton).toBeVisible();
  });

  test('displays product features', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    expect(await detail.getFeatureCount()).toBe(mockProductDetail.features.length);
  });

  test('displays customer reviews', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.reviewsSection).toBeVisible();
    expect(await detail.getReviewCount()).toBe(mockProductReviews.items.length);
  });

  test('displays related products', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.relatedSection).toBeVisible();
    expect(await detail.getRelatedProductCount()).toBe(mockRelatedProducts.length);
  });
});
