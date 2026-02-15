import { Page, Route } from '@playwright/test';
import { setupFeatureApiMocks } from '../../../../e2e-shared/fixtures';
import {
  mockAuthResponse,
  mockUserProfile,
  mockOrders,
} from './mock-data';

/**
 * Injects auth tokens into localStorage so the auth guard passes.
 */
export async function injectAuth(page: Page): Promise<void> {
  await page.addInitScript((authData) => {
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('auth_user', JSON.stringify(authData));
  }, mockAuthResponse);
}

function json(route: Route, body: unknown, status = 200): Promise<void> {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

/**
 * Sets up all API route mocks for the Mane Haus application.
 * Extends shared feature mocks with Mane Haus auth + order routes.
 */
export async function setupApiMocks(page: Page): Promise<void> {
  // Mane Haus-specific routes must be registered first (more specific patterns)
  await page.route('**/api/identity/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/api/identity/auth/login') && method === 'POST')
      return json(route, mockAuthResponse);
    if (url.includes('/api/identity/auth/register') && method === 'POST')
      return json(route, mockAuthResponse, 201);
    if (url.match(/\/api\/identity\/users\/[^/]+$/) && method === 'GET')
      return json(route, mockUserProfile);
    if (url.match(/\/api\/identity\/users\/[^/]+$/) && method === 'PUT') {
      const body = route.request().postDataJSON();
      return json(route, { ...mockUserProfile, ...body });
    }
    return route.continue();
  });

  await page.route('**/api/orders/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.match(/\/api\/orders\/[^/]+$/) && method === 'GET')
      return json(route, mockOrders[0]);
    if (url.includes('/api/orders') && method === 'GET')
      return json(route, mockOrders);
    return route.continue();
  });

  // Shared feature mocks (catalog, content, newsletter, chat, etc.)
  await setupFeatureApiMocks(page);
}
