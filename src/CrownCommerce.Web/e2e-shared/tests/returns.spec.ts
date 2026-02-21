import { test, expect } from '@playwright/test';
import { ReturnsPagePOM } from '../page-objects/pages/returns.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockReturnsPolicy } from '../fixtures/mock-data';

test.describe('ReturnsPage (feat-returns-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const returns = new ReturnsPagePOM(page);
    await returns.goto();
    await expect(returns.root).toBeVisible();
    await expect(returns.heroTitle).toContainText(mockReturnsPolicy.heroTitle);
    await expect(returns.heroLabel).toContainText('POLICY');
  });

  test('displays hero subtitle', async ({ page }) => {
    const returns = new ReturnsPagePOM(page);
    await returns.goto();
    await expect(returns.heroSubtitle).toContainText(mockReturnsPolicy.heroSubtitle);
  });

  test('displays return condition cards', async ({ page }) => {
    const returns = new ReturnsPagePOM(page);
    await returns.goto();
    await expect(returns.conditionsGrid).toBeVisible();
    expect(await returns.getConditionCardCount()).toBe(mockReturnsPolicy.conditions.length);
  });

  test('displays return process steps', async ({ page }) => {
    const returns = new ReturnsPagePOM(page);
    await returns.goto();
    await expect(returns.stepsGrid).toBeVisible();
    expect(await returns.getStepCardCount()).toBe(mockReturnsPolicy.processSteps.length);
  });
});
