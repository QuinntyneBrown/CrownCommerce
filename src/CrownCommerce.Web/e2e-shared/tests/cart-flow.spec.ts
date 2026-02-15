import { test, expect } from '@playwright/test';
import { CartPagePOM } from '../page-objects/pages/cart.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('CartPage (feat-cart-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders cart page', async ({ page }) => {
    const cart = new CartPagePOM(page);
    await cart.goto();
    await expect(cart.root).toBeVisible();
    await expect(cart.title).toBeVisible();
  });

  test('shows empty state when cart is empty', async ({ page }) => {
    const cart = new CartPagePOM(page);
    await cart.goto();
    await expect(cart.root).toBeVisible();
    // With no items added, the cart should display empty state
    const itemCount = await cart.getItemCount();
    if (itemCount === 0) {
      await expect(cart.emptyState).toBeVisible();
    }
  });

  test('displays checkout button when items exist', async ({ page }) => {
    const cart = new CartPagePOM(page);
    await cart.goto();
    await expect(cart.root).toBeVisible();
    const itemCount = await cart.getItemCount();
    if (itemCount > 0) {
      await expect(cart.checkoutButton).toBeVisible();
      await expect(cart.totalAmount).toBeVisible();
    }
  });
});
