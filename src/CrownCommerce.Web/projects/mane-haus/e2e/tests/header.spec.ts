import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Header', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the header', async () => {
    await expect(homePage.header.root).toBeVisible();
  });

  test('should display the logo with "MANE HAUS"', async () => {
    await expect(homePage.header.logo).toBeVisible();
    await expect(homePage.header.logo).toContainText('MANE HAUS');
  });

  test('should display navigation links', async () => {
    const links = await homePage.header.getNavLinkTexts();
    expect(links.map((l) => l.trim())).toEqual([
      'Collection',
      'Our Story',
      'Hair Care',
      'Contact',
    ]);
  });

  test('should have correct navigation hrefs', async () => {
    expect(await homePage.header.getNavLinkHref('Collection')).toBe('/collection');
    expect(await homePage.header.getNavLinkHref('Our Story')).toBe('/our-story');
    expect(await homePage.header.getNavLinkHref('Hair Care')).toBe('/hair-care');
    expect(await homePage.header.getNavLinkHref('Contact')).toBe('/contact');
  });

  test('should display Shop Now button', async () => {
    await expect(homePage.header.shopNowButton).toBeVisible();
    await expect(homePage.header.shopNowButton).toContainText('SHOP NOW');
  });

  test('should display cart link', async () => {
    await expect(homePage.header.cartLink).toBeVisible();
  });
});
