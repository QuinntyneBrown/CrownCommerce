import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Footer', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.footer.root.scrollIntoViewIfNeeded();
    await expect(homePage.footer.root).toBeVisible();
  });

  test('should display the footer', async () => {
    await expect(homePage.footer.root).toBeVisible();
  });

  test('should display the logo', async () => {
    await expect(homePage.footer.logo).toBeVisible();
    await expect(homePage.footer.logo).toContainText('MANE HAUS');
  });

  test('should display the tagline', async () => {
    await expect(homePage.footer.tagline).toBeVisible();
    const text = await homePage.footer.tagline.textContent();
    expect(text).toContain('Premium hair for the woman who sets the standard');
    expect(text).toContain('Toronto');
  });

  test('should display social icons', async () => {
    await expect(homePage.footer.socialIcons).toBeVisible();
  });

  test('should display 3 social links', async () => {
    const count = await homePage.footer.socialLinks.count();
    expect(count).toBe(3);
  });

  test('should have correct Instagram link', async () => {
    const href = await homePage.footer.getSocialLinkHref('instagram');
    expect(href).toBe('https://instagram.com/manehaus');
  });

  test('should have correct TikTok link', async () => {
    const href = await homePage.footer.getSocialLinkHref('tiktok');
    expect(href).toBe('https://tiktok.com/@manehaus');
  });

  test('should have correct email link', async () => {
    const href = await homePage.footer.getSocialLinkHref('email');
    expect(href).toBe('mailto:hello@manehaus.ca');
  });

  test('should display 3 footer link columns', async () => {
    const count = await homePage.footer.footerLinks.count();
    expect(count).toBe(3);
  });

  test('should display Shop column with correct links', async () => {
    const links = await homePage.footer.getColumnLinks('Shop');
    expect(links).toEqual(['Bundles', 'Closures', 'Frontals', 'Bundle Deals']);
  });

  test('should display Company column with correct links', async () => {
    const links = await homePage.footer.getColumnLinks('Company');
    expect(links).toEqual(['Our Story', 'Contact', 'Wholesale', 'Ambassador Program']);
  });

  test('should display Support column with correct links', async () => {
    const links = await homePage.footer.getColumnLinks('Support');
    expect(links).toEqual(['Hair Care Guide', 'Shipping Info', 'Returns & Exchanges', 'FAQ']);
  });

  test('should display a divider', async () => {
    await expect(homePage.footer.divider).toBeVisible();
  });

  test('should display copyright text', async () => {
    await homePage.footer.copyright.scrollIntoViewIfNeeded();
    await expect(homePage.footer.copyright).toContainText('2026 Mane Haus');
    await expect(homePage.footer.copyright).toContainText('All rights reserved');
  });

  test('should display location text', async () => {
    await homePage.footer.location.scrollIntoViewIfNeeded();
    await expect(homePage.footer.location).toHaveText('Toronto, Ontario, Canada');
  });
});
