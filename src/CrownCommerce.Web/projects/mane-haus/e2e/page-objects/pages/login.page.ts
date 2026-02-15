import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.auth-page');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.signInButton = this.root.locator('lib-button button[type="submit"]');
    this.errorMessage = this.root.locator('.auth-page__submit-error');
    this.registerLink = this.root.locator('.auth-page__footer a');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
    await this.root.waitFor({ state: 'visible' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
