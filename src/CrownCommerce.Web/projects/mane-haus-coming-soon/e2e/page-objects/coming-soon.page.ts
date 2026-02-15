import { Locator, Page } from '@playwright/test';

export class ComingSoonPage {
  // Header
  readonly logo: Locator;

  // Hero
  readonly preHeading: Locator;
  readonly titleDesktop: Locator;
  readonly titleMobile: Locator;
  readonly taglineDesktop: Locator;
  readonly taglineMobile: Locator;
  readonly accentDivider: Locator;
  readonly divider: Locator;

  // Countdown
  readonly countdown: Locator;

  // Email signup
  readonly signupSection: Locator;
  readonly signupLabel: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  // Footer
  readonly socialLink: Locator;
  readonly copyright: Locator;

  constructor(private page: Page) {
    // Header
    this.logo = page.locator('lib-logo');

    // Hero
    this.preHeading = page.locator('.coming-soon__pre');
    this.titleDesktop = page.locator('.coming-soon__title--desktop');
    this.titleMobile = page.locator('.coming-soon__title--mobile');
    this.taglineDesktop = page.locator('.coming-soon__tagline--desktop');
    this.taglineMobile = page.locator('.coming-soon__tagline--mobile');
    this.accentDivider = page.locator('lib-divider');
    this.divider = page.locator('.coming-soon__divider');

    // Countdown
    this.countdown = page.locator('lib-countdown-timer');

    // Email signup
    this.signupSection = page.locator('.coming-soon__signup');
    this.signupLabel = page.locator('.coming-soon__signup-label');
    this.emailInput = page.locator('lib-email-signup input[type="email"]');
    this.submitButton = page.locator('lib-email-signup button[type="submit"]');

    // Footer
    this.socialLink = page.locator('.coming-soon__social');
    this.copyright = page.locator('.coming-soon__copy');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.preHeading.waitFor({ state: 'visible' });
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async getEmailInputValue(): Promise<string> {
    return (await this.emailInput.inputValue()) ?? '';
  }
}
