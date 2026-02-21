import { test, expect } from '@playwright/test';
import { OurStoryPagePOM } from '../page-objects/pages/our-story.page';
import { ShippingInfoPagePOM } from '../page-objects/pages/shipping-info.page';
import { ReturnsPagePOM } from '../page-objects/pages/returns.page';
import { HairCareGuidePagePOM } from '../page-objects/pages/hair-care-guide.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('Content Routes (previously ContentPage)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('/about now renders OurStoryPage', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.root).toBeVisible();
    await expect(story.heroTitle).toBeVisible();
  });

  test('/shipping-info now renders ShippingInfoPage', async ({ page }) => {
    const shipping = new ShippingInfoPagePOM(page);
    await shipping.goto();
    await expect(shipping.root).toBeVisible();
    await expect(shipping.heroTitle).toBeVisible();
  });

  test('/returns now renders ReturnsPage', async ({ page }) => {
    const returns = new ReturnsPagePOM(page);
    await returns.goto();
    await expect(returns.root).toBeVisible();
    await expect(returns.heroTitle).toBeVisible();
  });

  test('/hair-care-guide now renders HairCareGuidePage', async ({ page }) => {
    const guide = new HairCareGuidePagePOM(page);
    await guide.goto();
    await expect(guide.root).toBeVisible();
    await expect(guide.heroTitle).toBeVisible();
  });
});
