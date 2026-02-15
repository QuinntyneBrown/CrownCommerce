import { type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.auth-page');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.createAccountButton = this.root.locator('lib-button button[type="submit"]');
    this.errorMessage = this.root.locator('.auth-page__submit-error');
    this.loginLink = this.root.locator('.auth-page__footer a');
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
    await this.page.waitForLoadState('domcontentloaded');
    await this.root.waitFor({ state: 'visible' });
  }

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
    await this.createAccountButton.click();
  }
}
