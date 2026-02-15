import { Page } from '@playwright/test';

/**
 * Sets up API route mocks for the Mane Haus coming soon page.
 */
export async function setupApiMocks(page: Page): Promise<void> {
  // Catch-all for any API calls
  await page.route('**/api/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  // Newsletter subscription
  await page.route('**/api/newsletter/subscribe', (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ email: body?.email, subscribedAt: new Date().toISOString() }),
      });
    } else {
      route.fallback();
    }
  });
}
