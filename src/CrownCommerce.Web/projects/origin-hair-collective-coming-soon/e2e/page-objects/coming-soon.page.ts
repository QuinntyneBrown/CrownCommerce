import { Locator, Page } from '@playwright/test';

export class ComingSoonPage {
  // Header
  readonly logo: Locator;

  // Hero
  readonly headline: Locator;
  readonly tagline: Locator;
  readonly badge: Locator;

  // Email signup
  readonly emailForm: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  // Footer
  readonly socialLinks: Locator;
  readonly instagramLink: Locator;
  readonly emailLink: Locator;
  readonly footerHandle: Locator;
  readonly footerCopyright: Locator;

  constructor(private page: Page) {
    // Header – scope logo to the <header> so it resolves to a single element
    this.logo = page.locator('header lib-logo');

    // Hero section
    this.headline = page.locator('.hero__headline');
    this.tagline = page.locator('.hero__tagline');
    this.badge = page.locator('.hero lib-badge');

    // Email signup (inside lib-email-signup component)
    this.emailForm = page.locator('lib-email-signup form');
    this.emailInput = page.locator('lib-email-signup input[type="email"]');
    this.submitButton = page.locator('lib-email-signup button[type="submit"]');

    // Footer
    this.socialLinks = page.locator('footer lib-social-icons .social-icons__link');
    this.instagramLink = page.locator('footer lib-social-icons a[aria-label="instagram"]');
    this.emailLink = page.locator('footer lib-social-icons a[aria-label="email"]');
    this.footerHandle = page.locator('.footer__handle');
    this.footerCopyright = page.locator('.footer__copyright');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.headline.waitFor({ state: 'visible' });
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async getEmailInputValue(): Promise<string> {
    return (await this.emailInput.inputValue()) ?? '';
  }
}
