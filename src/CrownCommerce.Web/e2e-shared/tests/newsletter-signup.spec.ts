import { test, expect } from '@playwright/test';
import { NewsletterSignupPOM } from '../page-objects/components/newsletter-signup.component';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('NewsletterSignup (feat-newsletter-signup)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('subscribes with valid email and shows success', async ({ page }) => {
    await page.goto('/');
    const newsletter = new NewsletterSignupPOM(page);
    await newsletter.subscribe('test@example.com');
    await expect(newsletter.successMessage).toBeVisible();
  });

  test('shows error for empty email submission', async ({ page }) => {
    await page.goto('/');
    const newsletter = new NewsletterSignupPOM(page);
    await newsletter.submitButton.click();
    // Expect HTML5 validation or custom error
    await expect(newsletter.emailInput).toBeFocused();
  });

  test('email input accepts keyboard input', async ({ page }) => {
    await page.goto('/');
    const newsletter = new NewsletterSignupPOM(page);
    await newsletter.emailInput.fill('user@example.com');
    await expect(newsletter.emailInput).toHaveValue('user@example.com');
  });
});
