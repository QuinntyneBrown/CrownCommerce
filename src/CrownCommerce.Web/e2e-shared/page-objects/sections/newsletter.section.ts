import { type Locator, type Page } from '@playwright/test';
import { NewsletterSignupPOM } from '../components/newsletter-signup.component';

export class NewsletterSectionPOM {
  readonly root: Locator;
  readonly heading: Locator;
  readonly subheading: Locator;
  readonly signup: NewsletterSignupPOM;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.newsletter');
    this.heading = this.root.locator('.newsletter__heading');
    this.subheading = this.root.locator('.newsletter__sub');
    this.signup = new NewsletterSignupPOM(page, this.root);
    this.successMessage = this.root.locator('.newsletter__success');
    this.errorMessage = this.root.locator('.newsletter__error');
  }

  async getHeadingText(): Promise<string | null> {
    return this.heading.textContent();
  }

  async getSubheadingText(): Promise<string | null> {
    return this.subheading.textContent();
  }

  async subscribe(email: string): Promise<void> {
    await this.signup.subscribe(email);
  }
}
