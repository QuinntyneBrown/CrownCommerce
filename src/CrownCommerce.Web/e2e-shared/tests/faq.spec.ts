import { test, expect } from '@playwright/test';
import { FaqPagePOM } from '../page-objects/pages/faq.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockFaqs } from '../fixtures/mock-data';

test.describe('FaqPage (feat-faq-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.root).toBeVisible();
    await expect(faq.heroTitle).toContainText('Frequently Asked Questions');
    await expect(faq.heroLabel).toContainText('HELP CENTER');
  });

  test('displays FAQ items as accordion', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.faqList).toBeVisible();
    expect(await faq.getItemCount()).toBe(mockFaqs.length);
  });

  test('toggles an accordion item on click', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.accordionItems.first()).toBeVisible();
    await faq.toggleItem(0);
    await expect(faq.accordionItems.first()).toContainText(mockFaqs[0].answer);
  });

  test('displays CTA section with contact button', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.ctaSection).toBeVisible();
    await expect(faq.ctaTitle).toContainText('Still Have Questions');
    await expect(faq.ctaButton).toBeVisible();
  });

  test('displays subtitle in hero', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.heroSubtitle).toBeVisible();
  });
});
