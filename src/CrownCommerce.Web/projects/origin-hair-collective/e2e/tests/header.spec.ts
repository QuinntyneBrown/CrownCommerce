import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';

test.describe('Header', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the Origin logo', async () => {
    await expect(homePage.header.logo).toBeVisible();
    await expect(homePage.header.logo).toContainText('ORIGIN');
  });

  test('should display all navigation links', async () => {
    const linkTexts = await homePage.header.getNavLinkTexts();
    expect(linkTexts).toEqual(['Collection', 'Our Story', 'Hair Care', 'Wholesale']);
  });

  test('should have correct href for Collection link', async () => {
    const href = await homePage.header.getNavLinkHref('Collection');
    expect(href).toBe('/shop');
  });

  test('should have correct href for Our Story link', async () => {
    const href = await homePage.header.getNavLinkHref('Our Story');
    expect(href).toBe('/about');
  });

  test('should have correct href for Hair Care link', async () => {
    const href = await homePage.header.getNavLinkHref('Hair Care');
    expect(href).toBe('/hair-care-guide');
  });

  test('should have correct href for Wholesale link', async () => {
    const href = await homePage.header.getNavLinkHref('Wholesale');
    expect(href).toBe('/wholesale');
  });

  test('should display Shop Now button on desktop and hide on mobile', async ({ page }) => {
    const isMobile = (page.viewportSize()?.width ?? 1280) < 768;
    if (isMobile) {
      await expect(homePage.header.shopNowButton).toBeHidden();
    } else {
      await expect(homePage.header.shopNowButton).toBeVisible();
      await expect(homePage.header.shopNowButton).toContainText('SHOP NOW');
    }
  });

  test('should have sticky positioning', async ({ page }) => {
    const position = await page.locator('header.header').evaluate(
      (el) => getComputedStyle(el).position
    );
    expect(position).toBe('sticky');
  });

  test('should remain visible after scrolling down', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 1000));
    await expect(homePage.header.root).toBeVisible();
  });

  test('should toggle hamburger menu visibility by viewport', async ({ page }) => {
    const isMobile = (page.viewportSize()?.width ?? 1280) < 768;
    if (isMobile) {
      await expect(homePage.header.mobileMenuButton).toBeVisible();
    } else {
      await expect(homePage.header.mobileMenuButton).toBeHidden();
    }
  });

  test('should toggle desktop navigation visibility by viewport', async ({ page }) => {
    const isMobile = (page.viewportSize()?.width ?? 1280) < 768;
    const isNavVisible = await homePage.header.isNavVisible();
    if (isMobile) {
      expect(isNavVisible).toBe(false);
    } else {
      expect(isNavVisible).toBe(true);
    }
  });
});
