import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page-objects/pages/register.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Register Page', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should display the register form', async () => {
    await expect(registerPage.root).toBeVisible();
  });

  test('should display the section header', async () => {
    await expect(registerPage.sectionHeader).toBeVisible();
    await expect(registerPage.sectionHeader).toContainText('Create Account');
  });

  test('should display all form fields', async () => {
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.phoneInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
  });

  test('should display create account button', async () => {
    await expect(registerPage.createAccountButton).toBeVisible();
    await expect(registerPage.createAccountButton).toContainText('CREATE ACCOUNT');
  });

  test('should display link to login page', async () => {
    await expect(registerPage.loginLink).toBeVisible();
    await expect(registerPage.loginLink).toHaveAttribute('href', '/login');
  });

  test('should show validation errors for empty submission', async () => {
    await registerPage.createAccountButton.click();
    await expect(registerPage.root.locator('.auth-page__error').first()).toBeVisible();
  });

  test('should navigate to account on successful registration', async ({ page }) => {
    await registerPage.register({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    await page.waitForURL('**/account');
    expect(page.url()).toContain('/account');
  });
});
