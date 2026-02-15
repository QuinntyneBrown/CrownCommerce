import { test, expect } from '@playwright/test';
import { ShopPagePOM } from '../page-objects/pages/shop.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('ShopPage (feat-shop-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders shop page with product grid', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.root).toBeVisible();
    expect(await shop.grid.getCardCount()).toBe(mockProducts.length);
  });

  test('displays filter buttons', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.filterButtons.first()).toBeVisible();
  });

  test('has a sort dropdown', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.sortSelect).toBeVisible();
  });

  test('clicking a filter button updates the active state', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.filterButtons.first()).toBeVisible();
    await shop.filterButtons.first().click();
    await expect(shop.filterButtons.first()).toHaveClass(/active/);
  });
});
