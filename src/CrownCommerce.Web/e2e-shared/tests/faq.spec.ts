import { test, expect } from '@playwright/test';
import { FaqPagePOM } from '../page-objects/pages/faq.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockFaqs } from '../fixtures/mock-data';

test.describe('FaqPage (feat-faq-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('displays FAQ items', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.root).toBeVisible();
    expect(await faq.getItemCount()).toBe(mockFaqs.length);
  });

  test('expands an FAQ item on click', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.items.first()).toBeVisible();
    expect(await faq.isItemExpanded(0)).toBe(false);
    await faq.toggleItem(0);
    expect(await faq.isItemExpanded(0)).toBe(true);
  });

  test('shows answer when expanded', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.items.first()).toBeVisible();
    await faq.toggleItem(0);
    const answer = await faq.getItemAnswer(0);
    expect(answer).toContain('12+ months');
  });

  test('collapses an expanded FAQ item', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.items.first()).toBeVisible();
    await faq.toggleItem(0);
    expect(await faq.isItemExpanded(0)).toBe(true);
    await faq.toggleItem(0);
    expect(await faq.isItemExpanded(0)).toBe(false);
  });

  test('displays question text', async ({ page }) => {
    const faq = new FaqPagePOM(page);
    await faq.goto();
    await expect(faq.items.first()).toBeVisible();
    const question = await faq.getItemQuestion(0);
    expect(question).toContain(mockFaqs[0].question);
  });
});
