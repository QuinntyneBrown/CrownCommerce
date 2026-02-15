import { test, expect } from '@playwright/test';
import { ComingSoonPage } from '../page-objects/coming-soon.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Coming Soon Page', () => {
  let comingSoon: ComingSoonPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    comingSoon = new ComingSoonPage(page);
    await comingSoon.goto();
  });

  test.describe('Header', () => {
    test('should display the logo', async () => {
      await expect(comingSoon.logo).toBeVisible();
    });

    test('should display "MANE HAUS" in the logo', async () => {
      await expect(comingSoon.logo).toContainText('MANE HAUS');
    });
  });

  test.describe('Hero Section', () => {
    test('should display "SOMETHING BEAUTIFUL IS COMING" pre-heading', async () => {
      await expect(comingSoon.preHeading).toHaveText('SOMETHING BEAUTIFUL IS COMING');
    });

    test('should display the accent divider', async () => {
      await expect(comingSoon.accentDivider).toBeVisible();
    });

    test('should display "MANE HAUS" title on desktop', async ({ page }) => {
      const viewport = page.viewportSize();
      if (viewport && viewport.width > 768) {
        await expect(comingSoon.titleDesktop).toBeVisible();
        await expect(comingSoon.titleDesktop).toHaveText('MANE HAUS');
      }
    });

    test('should display the tagline on desktop', async ({ page }) => {
      const viewport = page.viewportSize();
      if (viewport && viewport.width > 768) {
        await expect(comingSoon.taglineDesktop).toBeVisible();
      }
    });

    test('should display the thin divider', async () => {
      await expect(comingSoon.divider).toBeVisible();
    });
  });

  test.describe('Countdown Timer', () => {
    test('should display the countdown timer', async () => {
      await expect(comingSoon.countdown).toBeVisible();
    });
  });

  test.describe('Email Signup', () => {
    test('should display the signup section', async () => {
      await expect(comingSoon.signupSection).toBeVisible();
    });

    test('should have an email input', async () => {
      await expect(comingSoon.emailInput).toBeVisible();
      await expect(comingSoon.emailInput).toHaveAttribute('placeholder', 'Enter your email');
    });

    test('should display "NOTIFY ME" button', async () => {
      await expect(comingSoon.submitButton).toContainText('NOTIFY ME');
    });

    test('should clear input after valid email submission', async () => {
      await comingSoon.submitEmail('test@example.com');
      expect(await comingSoon.getEmailInputValue()).toBe('');
    });

    test('should not submit with an invalid email', async ({ page }) => {
      const consoleLogs: string[] = [];
      page.on('console', (msg) => consoleLogs.push(msg.text()));

      await comingSoon.emailInput.fill('not-an-email');
      await comingSoon.submitButton.click();

      expect(await comingSoon.getEmailInputValue()).toBe('not-an-email');
      expect(consoleLogs.filter((l) => l.includes('Email submitted'))).toHaveLength(0);
    });

    test('should not submit with an empty email', async ({ page }) => {
      const consoleLogs: string[] = [];
      page.on('console', (msg) => consoleLogs.push(msg.text()));

      await comingSoon.submitButton.click();

      expect(consoleLogs.filter((l) => l.includes('Email submitted'))).toHaveLength(0);
    });
  });

  test.describe('Footer', () => {
    test('should display the Instagram handle', async () => {
      await expect(comingSoon.socialLink).toHaveText('@ManeHaus');
    });

    test('should have correct Instagram link', async () => {
      await expect(comingSoon.socialLink).toHaveAttribute(
        'href',
        'https://instagram.com/manehaus'
      );
    });

    test('should display copyright notice', async () => {
      await expect(comingSoon.copyright).toContainText('2026 Mane Haus');
    });
  });
});
