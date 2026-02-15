import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Mobile Navigation', () => {
  let homePage: HomePage;

  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should show mobile menu button', async () => {
    const isVisible = await homePage.header.isMobileMenuButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('should open mobile menu when hamburger is clicked', async () => {
    await homePage.header.openMobileMenu();
    const isVisible = await homePage.mobileNav.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should display logo in mobile menu', async () => {
    await homePage.header.openMobileMenu();
    await expect(homePage.mobileNav.logo).toBeVisible();
  });

  test('should display navigation links in mobile menu', async () => {
    await homePage.header.openMobileMenu();
    const links = await homePage.mobileNav.getNavLinkTexts();
    expect(links.map((l) => l.trim())).toEqual([
      'Collection',
      'Our Story',
      'Hair Care',
      'Contact',
    ]);
  });

  test('should display Shop Now button in mobile menu', async () => {
    await homePage.header.openMobileMenu();
    await expect(homePage.mobileNav.shopNowButton).toBeVisible();
    await expect(homePage.mobileNav.shopNowButton).toContainText('SHOP NOW');
  });

  test('should close mobile menu with close button', async () => {
    await homePage.header.openMobileMenu();
    await expect(homePage.mobileNav.overlay).toBeVisible();
    await homePage.mobileNav.close();
    await expect(homePage.mobileNav.overlay).not.toBeVisible();
  });

  test('should close mobile menu when overlay is clicked', async ({ page }) => {
    await homePage.header.openMobileMenu();
    await expect(homePage.mobileNav.overlay).toBeVisible();
    // Click on the overlay area below the nav content
    const overlayBox = await homePage.mobileNav.overlay.boundingBox();
    if (overlayBox) {
      await page.mouse.click(overlayBox.x + overlayBox.width / 2, overlayBox.y + overlayBox.height - 10);
    }
    await expect(homePage.mobileNav.overlay).not.toBeVisible();
  });
});
