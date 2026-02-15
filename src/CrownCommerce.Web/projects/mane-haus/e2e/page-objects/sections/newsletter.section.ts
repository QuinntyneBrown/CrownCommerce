import { type Locator, type Page } from '@playwright/test';

export class NewsletterSection {
  readonly root: Locator;
  readonly heading: Locator;
  readonly subheading: Locator;
  readonly signup: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.newsletter-section');
    this.heading = this.root.locator('.newsletter-section__heading');
    this.subheading = this.root.locator('.newsletter-section__sub');
    this.signup = this.root.locator('app-newsletter-signup');
    this.emailInput = this.signup.locator('input[type="email"]');
    this.submitButton = this.signup.locator('lib-button button');
  }

  async getHeadingText(): Promise<string | null> {
    return this.heading.textContent();
  }

  async getSubheadingText(): Promise<string | null> {
    return this.subheading.textContent();
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
