import { test, expect } from '@playwright/test';
import { HairCareGuidePagePOM } from '../page-objects/pages/hair-care-guide.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockHairCareGuide } from '../fixtures/mock-data';

test.describe('HairCareGuidePage (feat-hair-care-guide-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const guide = new HairCareGuidePagePOM(page);
    await guide.goto();
    await expect(guide.root).toBeVisible();
    await expect(guide.heroTitle).toContainText(mockHairCareGuide.heroTitle);
    await expect(guide.heroLabel).toContainText('HAIR CARE GUIDE');
  });

  test('displays hero subtitle', async ({ page }) => {
    const guide = new HairCareGuidePagePOM(page);
    await guide.goto();
    await expect(guide.heroSubtitle).toContainText(mockHairCareGuide.heroSubtitle);
  });

  test('displays content sections', async ({ page }) => {
    const guide = new HairCareGuidePagePOM(page);
    await guide.goto();
    expect(await guide.getSectionCount()).toBe(mockHairCareGuide.sections.length);
  });

  test('displays tip cards', async ({ page }) => {
    const guide = new HairCareGuidePagePOM(page);
    await guide.goto();
    const totalTips = mockHairCareGuide.sections.reduce((sum, s) => sum + s.tips.length, 0);
    expect(await guide.getTipCardCount()).toBe(totalTips);
  });

  test('displays CTA section', async ({ page }) => {
    const guide = new HairCareGuidePagePOM(page);
    await guide.goto();
    await expect(guide.ctaSection).toBeVisible();
    await expect(guide.ctaTitle).toContainText(mockHairCareGuide.ctaTitle);
    await expect(guide.ctaButton).toBeVisible();
  });
});
