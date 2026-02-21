import { test, expect } from '@playwright/test';
import { BundleDealsPagePOM } from '../page-objects/pages/bundle-deals.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockBundleDeals } from '../fixtures/mock-data';

test.describe('BundleDealsPage (feat-bundle-deals-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const deals = new BundleDealsPagePOM(page);
    await deals.goto();
    await expect(deals.root).toBeVisible();
    await expect(deals.heroTitle).toContainText('Bundle Deals');
    await expect(deals.heroLabel).toContainText('CURATED SETS');
  });

  test('displays hero subtitle', async ({ page }) => {
    const deals = new BundleDealsPagePOM(page);
    await deals.goto();
    await expect(deals.heroSubtitle).toBeVisible();
  });

  test('displays savings badge', async ({ page }) => {
    const deals = new BundleDealsPagePOM(page);
    await deals.goto();
    await expect(deals.savingsBadge).toBeVisible();
    await expect(deals.savingsBadge).toContainText('UP TO 30% OFF');
  });

  test('displays deal cards', async ({ page }) => {
    const deals = new BundleDealsPagePOM(page);
    await deals.goto();
    await expect(deals.dealGrid).toBeVisible();
    expect(await deals.getDealCardCount()).toBe(mockBundleDeals.length);
  });
});
