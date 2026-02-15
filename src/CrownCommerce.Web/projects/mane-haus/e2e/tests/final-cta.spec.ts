import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Final CTA Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the final CTA section', async () => {
    await expect(homePage.finalCta.root).toBeVisible();
  });

  test('should display the heading', async () => {
    const heading = await homePage.finalCta.getHeadingText();
    expect(heading?.trim()).toBe('Ready to Elevate Your Look?');
  });

  test('should display the subline', async () => {
    const sub = await homePage.finalCta.getSublineText();
    expect(sub).toContain('Join thousands of women across Canada');
    expect(sub).toContain('Mane Haus');
  });

  test('should display the Shop Now button', async () => {
    await expect(homePage.finalCta.shopNowButton).toBeVisible();
    await expect(homePage.finalCta.shopNowButton).toContainText('SHOP NOW');
  });

  test('should display the trust text', async () => {
    const trust = await homePage.finalCta.getTrustText();
    expect(trust).toContain('Free shipping on orders over $150');
    expect(trust).toContain('30-day quality guarantee');
  });
});
