import { test, expect } from '@playwright/test';
import { ShopPagePOM } from '../page-objects/pages/shop.page';
import { CartPagePOM } from '../page-objects/pages/cart.page';
import { CheckoutPagePOM } from '../page-objects/pages/checkout.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('Full Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('checkout page renders with form fields', async ({ page }) => {
    const checkout = new CheckoutPagePOM(page);
    await checkout.goto();
    await expect(checkout.root).toBeVisible();
    await expect(checkout.nameInput).toBeVisible();
    await expect(checkout.emailInput).toBeVisible();
    await expect(checkout.addressInput).toBeVisible();
    await expect(checkout.submitButton).toBeVisible();
  });

  test('fill and submit checkout form shows success', async ({ page }) => {
    const checkout = new CheckoutPagePOM(page);
    await checkout.goto();
    await checkout.fillAndSubmit({
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Main St, Toronto, ON',
    });
    await expect(checkout.successState).toBeVisible({ timeout: 5000 });
  });

  test('shop → product detail → add to cart flow', async ({ page }) => {
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await expect(shop.grid.cards.first()).toBeVisible();
    await shop.grid.clickCard(0);
    await expect(page).toHaveURL(/\/product\/prod-001/);
  });
});
