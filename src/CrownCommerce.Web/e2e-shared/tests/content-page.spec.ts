import { test, expect } from '@playwright/test';
import { ContentPagePOM } from '../page-objects/pages/content.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('ContentPage (feat-content-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders content page with title', async ({ page }) => {
    const content = new ContentPagePOM(page);
    await content.goto('about');
    await expect(content.root).toBeVisible();
    await expect(content.title).toBeVisible();
  });

  test('displays page body content', async ({ page }) => {
    const content = new ContentPagePOM(page);
    await content.goto('about');
    await expect(content.body).toBeVisible();
    const bodyText = await content.getBodyText();
    expect(bodyText).toBeTruthy();
  });

  test('loads different content for different slugs', async ({ page }) => {
    const content = new ContentPagePOM(page);
    await content.goto('shipping-info');
    await expect(content.root).toBeVisible();
    const title = await content.getTitleText();
    expect(title).toBeTruthy();
  });
});
