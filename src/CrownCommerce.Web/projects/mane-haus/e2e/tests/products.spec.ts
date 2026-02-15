import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Products Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
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

  test('should display product cards after loading', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const count = await homePage.products.getProductCardCount();
    expect(count).toBe(3);
  });

  test('should display Brazilian Body Wave product', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const card = await homePage.products.getProductCardInfo(0);
    expect(card.title?.trim()).toBe('Brazilian Body Wave');
    expect(card.description).toContain('Premium body wave bundles');
    expect(card.price).toContain('$189');
  });

  test('should display Peruvian Straight product', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const card = await homePage.products.getProductCardInfo(1);
    expect(card.title?.trim()).toBe('Peruvian Straight');
  });

  test('should display HD Lace Closure product', async () => {
    await homePage.products.productCards.first().waitFor({ state: 'visible' });
    const card = await homePage.products.getProductCardInfo(2);
    expect(card.title?.trim()).toBe('HD Lace Closure');
  });
});
