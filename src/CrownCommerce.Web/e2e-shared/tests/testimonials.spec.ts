import { test, expect } from '@playwright/test';
import { TestimonialsSectionPOM } from '../page-objects/sections/testimonials.section';
import { setupFeatureApiMocks } from '../fixtures';
import { mockTestimonials } from '../fixtures/mock-data';

test.describe('Testimonials Section', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
    await page.goto('/');
  });

  test('displays testimonial cards', async ({ page }) => {
    const testimonials = new TestimonialsSectionPOM(page);
    await expect(testimonials.root).toBeVisible();
    expect(await testimonials.getCardCount()).toBe(mockTestimonials.length);
  });

  test('shows quote text', async ({ page }) => {
    const testimonials = new TestimonialsSectionPOM(page);
    await expect(testimonials.root).toBeVisible();
    const quote = await testimonials.getQuoteText(0);
    expect(quote).toBeTruthy();
    expect(quote).toContain(mockTestimonials[0].content.substring(0, 20));
  });

  test('shows author name', async ({ page }) => {
    const testimonials = new TestimonialsSectionPOM(page);
    await expect(testimonials.root).toBeVisible();
    const author = await testimonials.getAuthorText(0);
    expect(author).toContain(mockTestimonials[0].customerName);
  });

  test('shows star rating', async ({ page }) => {
    const testimonials = new TestimonialsSectionPOM(page);
    await expect(testimonials.root).toBeVisible();
    const stars = await testimonials.getStarsText(0);
    expect(stars).toBeTruthy();
  });

  test('shows section label', async ({ page }) => {
    const testimonials = new TestimonialsSectionPOM(page);
    await expect(testimonials.root).toBeVisible();
    const label = await testimonials.getLabelText();
    expect(label).toBeTruthy();
  });
});
