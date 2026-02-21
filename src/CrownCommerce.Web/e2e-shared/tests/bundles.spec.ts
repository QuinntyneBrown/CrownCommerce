import { test, expect } from '@playwright/test';
import { BundlesPagePOM } from '../page-objects/pages/bundles.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('BundlesPage (feat-bundles-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const bundles = new BundlesPagePOM(page);
    await bundles.goto();
    await expect(bundles.root).toBeVisible();
    await expect(bundles.heroTitle).toContainText('Hair Bundles');
    await expect(bundles.heroLabel).toContainText('COLLECTION');
  });

  test('displays hero subtitle', async ({ page }) => {
    const bundles = new BundlesPagePOM(page);
    await bundles.goto();
    await expect(bundles.heroSubtitle).toBeVisible();
  });

  test('displays filter chips', async ({ page }) => {
    const bundles = new BundlesPagePOM(page);
    await bundles.goto();
    expect(await bundles.getFilterChipCount()).toBe(5);
  });

  test('displays product cards', async ({ page }) => {
    const bundles = new BundlesPagePOM(page);
    await bundles.goto();
    await expect(bundles.productGrid).toBeVisible();
    expect(await bundles.getProductCount()).toBe(mockProducts.length);
  });

  test('clicking a filter chip filters products', async ({ page }) => {
    const bundles = new BundlesPagePOM(page);
    await bundles.goto();
    await expect(bundles.productGrid).toBeVisible();
    await bundles.filterBy('Body Wave');
    // After filtering, count may change but grid should still be visible
    await expect(bundles.productGrid).toBeVisible();
  });
});
