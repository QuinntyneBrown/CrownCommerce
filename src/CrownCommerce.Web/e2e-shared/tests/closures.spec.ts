import { test, expect } from '@playwright/test';
import { ClosuresPagePOM } from '../page-objects/pages/closures.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('ClosuresPage (feat-closures-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const closures = new ClosuresPagePOM(page);
    await closures.goto();
    await expect(closures.root).toBeVisible();
    await expect(closures.heroTitle).toContainText('Lace Closures');
    await expect(closures.heroLabel).toContainText('COLLECTION');
  });

  test('displays hero subtitle', async ({ page }) => {
    const closures = new ClosuresPagePOM(page);
    await closures.goto();
    await expect(closures.heroSubtitle).toBeVisible();
  });

  test('displays filter chips', async ({ page }) => {
    const closures = new ClosuresPagePOM(page);
    await closures.goto();
    expect(await closures.getFilterChipCount()).toBe(3);
  });

  test('displays product cards', async ({ page }) => {
    const closures = new ClosuresPagePOM(page);
    await closures.goto();
    await expect(closures.productGrid).toBeVisible();
    expect(await closures.getProductCount()).toBe(mockProducts.length);
  });

  test('clicking a filter chip filters products', async ({ page }) => {
    const closures = new ClosuresPagePOM(page);
    await closures.goto();
    await expect(closures.productGrid).toBeVisible();
    await closures.filterBy('4x4');
    await expect(closures.productGrid).toBeVisible();
  });
});
