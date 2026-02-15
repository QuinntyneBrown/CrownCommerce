import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Mane Haus/);
  });

  test('should display all major sections in order', async () => {
    await expect(homePage.hero.root).toBeVisible();
    await expect(homePage.trustBar.root).toBeVisible();
    await expect(homePage.brandStory.root).toBeVisible();
    await expect(homePage.products.root).toBeVisible();
    await expect(homePage.benefits.root).toBeVisible();
    await expect(homePage.testimonials.root).toBeVisible();
    await expect(homePage.community.root).toBeVisible();
    await expect(homePage.newsletter.root).toBeVisible();
    await expect(homePage.finalCta.root).toBeVisible();
  });

  test('should display the header', async () => {
    await expect(homePage.header.root).toBeVisible();
  });

  test('should display the footer', async () => {
    await expect(homePage.footer.root).toBeVisible();
  });
});
