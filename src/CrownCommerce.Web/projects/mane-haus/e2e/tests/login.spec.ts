import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/pages/login.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display the login form', async () => {
    await expect(loginPage.root).toBeVisible();
  });

  test('should display the section header', async () => {
    await expect(loginPage.sectionHeader).toBeVisible();
    await expect(loginPage.sectionHeader).toContainText('Sign In');
  });

  test('should display email and password inputs', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('should display sign in button', async () => {
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.signInButton).toContainText('SIGN IN');
  });

  test('should display link to register page', async () => {
    await expect(loginPage.registerLink).toBeVisible();
    await expect(loginPage.registerLink).toHaveAttribute('href', '/register');
  });

  test('should show validation errors for empty submission', async () => {
    // Touch the fields by focusing and blurring them
    await loginPage.emailInput.click();
    await loginPage.passwordInput.click();
    await loginPage.signInButton.click();
    await expect(loginPage.root.locator('.auth-page__error').first()).toBeVisible();
  });

  test('should navigate to account on successful login', async ({ page }) => {
    await loginPage.login('test@manehaus.ca', 'password123');
    await page.waitForURL('**/account');
    expect(page.url()).toContain('/account');
  });
});
