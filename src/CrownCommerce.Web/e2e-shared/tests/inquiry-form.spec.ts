import { test, expect } from '@playwright/test';
import { ContactPagePOM } from '../page-objects/pages/contact.page';
import { WholesalePagePOM } from '../page-objects/pages/wholesale.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('InquiryForm (feat-inquiry-form)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('contact page renders with inquiry form', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    await expect(contact.root).toBeVisible();
    await expect(contact.inquiryForm.root).toBeVisible();
  });

  test('fill and submit contact form shows success', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    await contact.inquiryForm.fillAndSubmit({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'I have a question about your products.',
    });
    await expect(contact.inquiryForm.successMessage).toBeVisible({ timeout: 5000 });
  });

  test('form fields are present', async ({ page }) => {
    const contact = new ContactPagePOM(page);
    await contact.goto();
    await expect(contact.inquiryForm.nameInput).toBeVisible();
    await expect(contact.inquiryForm.emailInput).toBeVisible();
    await expect(contact.inquiryForm.messageInput).toBeVisible();
  });

  test('wholesale page also has inquiry form', async ({ page }) => {
    const wholesale = new WholesalePagePOM(page);
    await wholesale.goto();
    await expect(wholesale.root).toBeVisible();
    await expect(wholesale.inquiryForm.root).toBeVisible();
  });
});
