import { test, expect } from '@playwright/test';
import { ShopPagePOM } from '../page-objects/pages/shop.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('ShopPage (feat-shop-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.root).toBeVisible();
    await expect(shop.heroTitle).toBeVisible();
    await expect(shop.heroTitle).toContainText('Shop Premium Virgin Hair');
  });

  test('displays hero label and description', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.heroLabel).toContainText('THE COLLECTION');
    await expect(shop.heroDescription).toBeVisible();
  });

  test('renders sidebar with filter groups', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.sidebar).toBeVisible();
    await expect(shop.sidebarTitle).toContainText('Filters');
    expect(await shop.getFilterGroupCount()).toBe(4);
  });

  test('renders product grid with cards', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.productGrid).toBeVisible();
    expect(await shop.getProductCount()).toBe(mockProducts.length);
  });

  test('displays sort bar with product count', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.sortBar).toBeVisible();
    await expect(shop.productCount).toContainText(`${mockProducts.length} products`);
  });

  test('has a sort dropdown', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.sortSelect).toBeVisible();
  });

  test('clicking a filter item updates the active state', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.filterItems.first()).toBeVisible();
    await shop.filterItems.first().click();
    await expect(shop.filterItems.first()).toHaveClass(/active/);
  });
});
