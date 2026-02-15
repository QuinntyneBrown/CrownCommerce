import { type Locator, type Page } from '@playwright/test';

export class NewsletterSignupPOM {
  readonly root: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-newsletter-signup');
    this.emailInput = this.root.locator('input[type="email"]');
    this.submitButton = this.root.locator('lib-button button');
    this.successMessage = this.root.locator('.newsletter-signup__success');
    this.errorMessage = this.root.locator('.newsletter-signup__error');
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async isSuccess(): Promise<boolean> {
    return this.successMessage.isVisible();
  }

  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
