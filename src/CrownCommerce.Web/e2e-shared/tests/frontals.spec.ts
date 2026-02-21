import { test, expect } from '@playwright/test';
import { FrontalsPagePOM } from '../page-objects/pages/frontals.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('FrontalsPage (feat-frontals-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const frontals = new FrontalsPagePOM(page);
    await frontals.goto();
    await expect(frontals.root).toBeVisible();
    await expect(frontals.heroTitle).toContainText('Lace Frontals');
    await expect(frontals.heroLabel).toContainText('COLLECTION');
  });

  test('displays hero subtitle', async ({ page }) => {
    const frontals = new FrontalsPagePOM(page);
    await frontals.goto();
    await expect(frontals.heroSubtitle).toBeVisible();
  });

  test('displays filter chips', async ({ page }) => {
    const frontals = new FrontalsPagePOM(page);
    await frontals.goto();
    expect(await frontals.getFilterChipCount()).toBe(3);
  });

  test('displays product cards', async ({ page }) => {
    const frontals = new FrontalsPagePOM(page);
    await frontals.goto();
    await expect(frontals.productGrid).toBeVisible();
    expect(await frontals.getProductCount()).toBe(mockProducts.length);
  });

  test('clicking a filter chip filters products', async ({ page }) => {
    const frontals = new FrontalsPagePOM(page);
    await frontals.goto();
    await expect(frontals.productGrid).toBeVisible();
    await frontals.filterBy('13x4');
    await expect(frontals.productGrid).toBeVisible();
  });
});
