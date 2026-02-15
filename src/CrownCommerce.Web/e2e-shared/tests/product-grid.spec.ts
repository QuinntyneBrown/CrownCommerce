import { test, expect } from '@playwright/test';
import { ProductGridPOM } from '../page-objects/components/product-grid.component';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('ProductGrid (feat-product-grid)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('displays products from API', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    await expect(grid.cards.first()).toBeVisible();
    expect(await grid.getCardCount()).toBe(mockProducts.length);
  });

  test('shows product name and price on each card', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    await expect(grid.cards.first()).toBeVisible();
    const info = await grid.getCardInfo(0);
    expect(info.title).toContain(mockProducts[0].name);
    expect(info.price).toContain('85');
  });

  test('clicking a card navigates to product detail', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    await expect(grid.cards.first()).toBeVisible();
    await grid.clickCard(0);
    await expect(page).toHaveURL(/\/product\/prod-001/);
  });

  test('shows product description on cards', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    await expect(grid.cards.first()).toBeVisible();
    const info = await grid.getCardInfo(0);
    expect(info.description).toBeTruthy();
  });
});
