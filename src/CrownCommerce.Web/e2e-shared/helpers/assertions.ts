import { expect, type Locator, type Page } from '@playwright/test';

/** Assert an element is visible and contains expected text. */
export async function expectVisibleWithText(locator: Locator, text: string): Promise<void> {
  await expect(locator).toBeVisible();
  await expect(locator).toContainText(text);
}

/** Assert the page URL matches a pattern. */
export async function expectUrlContains(page: Page, path: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(path));
}

/** Assert a count of items within a locator. */
export async function expectCount(locator: Locator, count: number): Promise<void> {
  await expect(locator).toHaveCount(count);
}

/** Assert an element becomes visible within a timeout. */
export async function expectEventuallyVisible(locator: Locator, timeout = 5000): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
}
