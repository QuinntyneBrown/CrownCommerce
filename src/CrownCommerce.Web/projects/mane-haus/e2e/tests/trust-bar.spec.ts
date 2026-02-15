import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Trust Bar', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the trust bar section', async () => {
    await expect(homePage.trustBar.root).toBeVisible();
  });

  test('should display exactly 3 trust bar items', async () => {
    const count = await homePage.trustBar.getItemCount();
    expect(count).toBe(3);
  });

  test('should display correct trust bar texts', async () => {
    const texts = await homePage.trustBar.getItemTexts();
    expect(texts.map((t) => t.trim())).toEqual([
      'Authentic',
      'Free Shipping',
      '5-Star Rated',
    ]);
  });
});
