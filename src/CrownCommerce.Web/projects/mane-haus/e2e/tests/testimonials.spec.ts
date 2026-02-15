import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Testimonials Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the testimonials section', async () => {
    await expect(homePage.testimonials.root).toBeVisible();
  });

  test('should display the "WHAT THEY SAY" label', async () => {
    const label = await homePage.testimonials.getLabelText();
    expect(label?.trim()).toBe('WHAT THEY SAY');
  });

  test('should display testimonial cards after loading', async () => {
    await homePage.testimonials.testimonialCards.first().waitFor({ state: 'visible' });
    const count = await homePage.testimonials.getTestimonialCount();
    expect(count).toBe(2);
  });
});
