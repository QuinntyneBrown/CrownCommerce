import { test, expect } from '@playwright/test';
import { ContactPagePOM } from '../page-objects/pages/contact.page';
import { WholesalePagePOM } from '../page-objects/pages/wholesale.page';
import { AmbassadorPagePOM } from '../page-objects/pages/ambassador.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    await expect(contact.root).toBeVisible();
    await expect(contact.heroTitle).toContainText("We'd Love to Hear From You");
  });

  test('displays contact info cards', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    expect(await contact.getInfoCardCount()).toBe(3);
  });

  test('displays form with fields', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    await expect(contact.formCard).toBeVisible();
    await expect(contact.nameInput).toBeVisible();
    await expect(contact.emailInput).toBeVisible();
    await expect(contact.subjectSelect).toBeVisible();
    await expect(contact.messageTextarea).toBeVisible();
    await expect(contact.submitButton).toBeVisible();
  });

  test('displays checklist features', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    expect(await contact.getFeatureCount()).toBeGreaterThan(0);
  });
});

test.describe('Wholesale Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section', async ({ page }) => {
    const wholesale = new WholesalePagePOM(page);
    await wholesale.goto();
    await expect(wholesale.root).toBeVisible();
    await expect(wholesale.heroTitle).toContainText('Partner With Origin');
  });

  test('displays benefit cards', async ({ page }) => {
    const wholesale = new WholesalePagePOM(page);
    await wholesale.goto();
    expect(await wholesale.getBenefitCardCount()).toBe(3);
  });

  test('displays pricing tiers', async ({ page }) => {
    const wholesale = new WholesalePagePOM(page);
    await wholesale.goto();
    await expect(wholesale.tiersGrid).toBeVisible();
    expect(await wholesale.getTierCardCount()).toBe(3);
  });

  test('displays inquiry form', async ({ page }) => {
    const wholesale = new WholesalePagePOM(page);
    await wholesale.goto();
    await expect(wholesale.formCard).toBeVisible();
    await expect(wholesale.submitButton).toBeVisible();
  });
});

test.describe('Ambassador Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero with title', async ({ page }) => {
    const ambassador = new AmbassadorPagePOM(page);
    await ambassador.goto();
    await expect(ambassador.root).toBeVisible();
    await expect(ambassador.heroTitle).toContainText('Become an Ambassador');
  });

  test('displays perk cards', async ({ page }) => {
    const ambassador = new AmbassadorPagePOM(page);
    await ambassador.goto();
    expect(await ambassador.getPerkCardCount()).toBe(4);
  });

  test('displays how-it-works steps', async ({ page }) => {
    const ambassador = new AmbassadorPagePOM(page);
    await ambassador.goto();
    expect(await ambassador.getStepCardCount()).toBe(3);
  });

  test('displays CTA section', async ({ page }) => {
    const ambassador = new AmbassadorPagePOM(page);
    await ambassador.goto();
    await expect(ambassador.ctaSection).toBeVisible();
    await expect(ambassador.ctaTitle).toBeVisible();
  });

  test('displays application form', async ({ page }) => {
    const ambassador = new AmbassadorPagePOM(page);
    await ambassador.goto();
    await expect(ambassador.applyForm).toBeVisible();
    await expect(ambassador.submitButton).toBeVisible();
  });
});
