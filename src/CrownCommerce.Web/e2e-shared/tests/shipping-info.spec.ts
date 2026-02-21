import { test, expect } from '@playwright/test';
import { ShippingInfoPagePOM } from '../page-objects/pages/shipping-info.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockShippingPolicy } from '../fixtures/mock-data';

test.describe('ShippingInfoPage (feat-shipping-info-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const shipping = new ShippingInfoPagePOM(page);
    await shipping.goto();
    await expect(shipping.root).toBeVisible();
    await expect(shipping.heroTitle).toContainText(mockShippingPolicy.heroTitle);
    await expect(shipping.heroLabel).toContainText('DELIVERY');
  });

  test('displays hero subtitle', async ({ page }) => {
    const shipping = new ShippingInfoPagePOM(page);
    await shipping.goto();
    await expect(shipping.heroSubtitle).toContainText(mockShippingPolicy.heroSubtitle);
  });

  test('displays shipping rate cards', async ({ page }) => {
    const shipping = new ShippingInfoPagePOM(page);
    await shipping.goto();
    await expect(shipping.ratesGrid).toBeVisible();
    expect(await shipping.getRateCardCount()).toBe(mockShippingPolicy.zones.length);
  });

  test('displays processing section', async ({ page }) => {
    const shipping = new ShippingInfoPagePOM(page);
    await shipping.goto();
    await expect(shipping.processingSection).toBeVisible();
    await expect(shipping.processingBody).toContainText(mockShippingPolicy.processingTime);
  });

  test('displays process notes as checklist', async ({ page }) => {
    const shipping = new ShippingInfoPagePOM(page);
    await shipping.goto();
    expect(await shipping.getProcessNoteCount()).toBe(mockShippingPolicy.processSteps.length);
  });
});
