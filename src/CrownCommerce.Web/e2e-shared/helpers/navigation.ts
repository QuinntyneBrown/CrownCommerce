import { type Page } from '@playwright/test';

/** Navigate to a page and wait for DOM content loaded. */
export async function navigateTo(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('domcontentloaded');
}

/** Navigate to the home page. */
export async function goHome(page: Page): Promise<void> {
  await navigateTo(page, '/');
}

/** Navigate to the shop page. Accepts an optional app-specific path. */
export async function goToShop(page: Page, path = '/shop'): Promise<void> {
  await navigateTo(page, path);
}

/** Navigate to a product detail page. */
export async function goToProduct(page: Page, productId: string): Promise<void> {
  await navigateTo(page, `/product/${productId}`);
}

/** Navigate to the cart page. */
export async function goToCart(page: Page): Promise<void> {
  await navigateTo(page, '/cart');
}

/** Navigate to the checkout page. */
export async function goToCheckout(page: Page): Promise<void> {
  await navigateTo(page, '/checkout');
}
