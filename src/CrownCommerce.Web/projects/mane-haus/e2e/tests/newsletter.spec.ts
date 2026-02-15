import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Newsletter Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the newsletter section', async () => {
    await expect(homePage.newsletter.root).toBeVisible();
  });

  test('should display the heading', async () => {
    const heading = await homePage.newsletter.getHeadingText();
    expect(heading?.trim()).toBe('Stay in the Loop');
  });

  test('should display the subheading', async () => {
    const sub = await homePage.newsletter.getSubheadingText();
    expect(sub).toContain('exclusive deals');
  });

  test('should display the newsletter signup form', async () => {
    await expect(homePage.newsletter.signup).toBeVisible();
  });

  test('should display the email input', async () => {
    await expect(homePage.newsletter.emailInput).toBeVisible();
  });

  test('should display the subscribe button', async () => {
    await expect(homePage.newsletter.submitButton).toBeVisible();
    await expect(homePage.newsletter.submitButton).toContainText('SUBSCRIBE');
  });
});
