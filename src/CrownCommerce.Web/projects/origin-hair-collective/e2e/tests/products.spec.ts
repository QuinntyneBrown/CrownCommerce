import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';

test.describe('Products Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the products section', async () => {
    await expect(homePage.products.root).toBeVisible();
  });

  test('should have the #collection anchor id', async ({ page }) => {
    const section = page.locator('section.products');
    await expect(section).toHaveAttribute('id', 'collection');
  });

  test('should display the section label', async () => {
    const label = await homePage.products.getLabelText();
    expect(label?.trim()).toBe('THE COLLECTION');
  });

  test('should display the section heading', async () => {
    const heading = await homePage.products.getHeadingText();
    expect(heading?.trim()).toBe('Premium Hair, Curated For You');
  });

  test('should display exactly 3 product cards', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const count = await homePage.products.getProductCardCount();
    expect(count).toBe(3);
  });

  test('should display first product card with correct info', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const card = await homePage.products.getProductCardInfo(0);
    expect(card.tag?.trim()).toBe('BUNDLE');
    expect(card.title?.trim()).toBe('Cambodian Straight Bundle');
    expect(card.price?.trim()).toBe('From $185 CAD');
  });

  test('should display second product card with correct info', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const card = await homePage.products.getProductCardInfo(1);
    expect(card.tag?.trim()).toBe('BUNDLE');
    expect(card.title?.trim()).toBe('Cambodian Wavy Bundle');
    expect(card.price?.trim()).toBe('From $210 CAD');
  });

  test('should display third product card with correct info', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const card = await homePage.products.getProductCardInfo(2);
    expect(card.tag?.trim()).toBe('BUNDLE');
    expect(card.title?.trim()).toBe('Indonesian Silky Straight Bundle');
    expect(card.price?.trim()).toBe('From $195 CAD');
  });

  test('should display images for all product cards', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    for (let i = 0; i < 3; i++) {
      const hasImage = await homePage.products.hasProductImage(i);
      expect(hasImage).toBe(true);
    }
  });

  test('should have alt text matching product title on images', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const expectedAlts = ['Cambodian Straight Bundle', 'Cambodian Wavy Bundle', 'Indonesian Silky Straight Bundle'];
    for (let i = 0; i < 3; i++) {
      const alt = await homePage.products.getProductImageAlt(i);
      expect(alt).toBe(expectedAlts[i]);
    }
  });
});
