import { test, expect } from '@playwright/test';
import { NotFoundPagePOM } from '../page-objects/pages/not-found.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('NotFoundPage (feat-not-found-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    const notFound = new NotFoundPagePOM(page);
    await expect(notFound.root).toBeVisible();
  });

  test('displays 404 code', async ({ page }) => {
    await page.goto('/nonexistent-page');
    const notFound = new NotFoundPagePOM(page);
    await expect(notFound.root).toBeVisible();
    const code = await notFound.getCodeText();
    expect(code).toContain('404');
  });

  test('displays a title and message', async ({ page }) => {
    await page.goto('/nonexistent-page');
    const notFound = new NotFoundPagePOM(page);
    await expect(notFound.root).toBeVisible();
    await expect(notFound.title).toBeVisible();
    await expect(notFound.message).toBeVisible();
  });

  test('has a link back to home', async ({ page }) => {
    await page.goto('/nonexistent-page');
    const notFound = new NotFoundPagePOM(page);
    await expect(notFound.root).toBeVisible();
    await expect(notFound.homeLink.first()).toBeVisible();
  });
});
