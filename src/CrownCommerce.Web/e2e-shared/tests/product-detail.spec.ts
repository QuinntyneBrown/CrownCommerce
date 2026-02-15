import { test, expect } from '@playwright/test';
import { ProductDetailPagePOM } from '../page-objects/pages/product-detail.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('ProductDetailPage (feat-product-detail-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('displays product name and price', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.productName).toBeVisible();
    expect(await detail.getProductName()).toContain(mockProducts[0].name);
    expect(await detail.getProductPrice()).toContain('85');
  });

  test('displays product image', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.productImage).toBeVisible();
  });

  test('shows product description', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.productDescription).toBeVisible();
    await expect(detail.productDescription).toContainText(mockProducts[0].description);
  });

  test('quantity defaults to 1', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.quantityValue).toBeVisible();
    expect(await detail.getQuantity()).toContain('1');
  });

  test('increment and decrement quantity', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.quantityValue).toBeVisible();
    await detail.incrementQuantity();
    expect(await detail.getQuantity()).toContain('2');
    await detail.decrementQuantity();
    expect(await detail.getQuantity()).toContain('1');
  });

  test('has add to cart button', async ({ page }) => {
    const detail = new ProductDetailPagePOM(page);
    await detail.goto('prod-001');
    await expect(detail.addToCartButton).toBeVisible();
  });
});
