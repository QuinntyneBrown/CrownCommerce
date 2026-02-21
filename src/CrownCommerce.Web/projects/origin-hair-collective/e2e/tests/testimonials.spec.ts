import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';

test.describe('Testimonials Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the testimonials section', async () => {
    await expect(homePage.testimonials.root).toBeVisible();
  });

  test('should display the section label', async () => {
    const label = await homePage.testimonials.getLabelText();
    expect(label?.trim()).toBe('WHAT THEY SAY');
  });

  test('should display testimonial cards', async () => {
    await expect(homePage.testimonials.cards).toHaveCount(3);
  });

  test('should display the decorative quote icon', async () => {
    await expect(homePage.testimonials.cards).toHaveCount(3);
    const hasQuoteIcon = await homePage.testimonials.hasQuoteIcon();
    expect(hasQuoteIcon).toBe(true);
  });

  test('should display the first testimonial quote', async () => {
    await expect(homePage.testimonials.cards).toHaveCount(3);
    const quote = await homePage.testimonials.getQuoteText(0);
    expect(quote).toContain('Cambodian straight bundles');
    expect(quote).toContain('unmatched');
  });

  test('should display 5-star rating', async () => {
    await expect(homePage.testimonials.cards).toHaveCount(3);
    const stars = await homePage.testimonials.getStarsText(0);
    expect(stars?.trim()).toBe('★ ★ ★ ★ ★');
  });

  test('should display the author name and location', async () => {
    await expect(homePage.testimonials.cards).toHaveCount(3);
    const author = await homePage.testimonials.getAuthorText(0);
    expect(author).toContain('Sarah M.');
    expect(author).toContain('Atlanta');
  });
});
