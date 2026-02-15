import { Page, Route } from '@playwright/test';
import {
  mockAuthResponse,
  mockUserProfile,
  mockProducts,
  mockTestimonials,
  mockGalleryImages,
  mockOrders,
  mockNewsletterResponse,
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
 */
export async function setupApiMocks(page: Page): Promise<void> {
  await page.route('**/api/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // ── Auth ──
    if (url.includes('/api/identity/auth/login') && method === 'POST') {
      return json(route, mockAuthResponse);
    }
    if (url.includes('/api/identity/auth/register') && method === 'POST') {
      return json(route, mockAuthResponse, 201);
    }

    // ── User Profile ──
    if (url.match(/\/api\/identity\/users\/[^/]+$/) && method === 'GET') {
      return json(route, mockUserProfile);
    }
    if (url.match(/\/api\/identity\/users\/[^/]+$/) && method === 'PUT') {
      const body = route.request().postDataJSON();
      return json(route, { ...mockUserProfile, ...body });
    }

    // ── Catalog / Products ──
    if (url.includes('/api/catalog/products') && method === 'GET') {
      return json(route, mockProducts);
    }
    if (url.match(/\/api\/catalog\/products\/[^/]+$/) && method === 'GET') {
      return json(route, mockProducts[0]);
    }

    // ── Content ──
    if (url.includes('/api/content/testimonials')) {
      return json(route, mockTestimonials);
    }
    if (url.includes('/api/content/gallery')) {
      return json(route, mockGalleryImages);
    }
    if (url.match(/\/api\/content\/pages\/[^/]+$/)) {
      return json(route, {
        slug: 'our-story',
        title: 'Our Story',
        sections: [{ type: 'text', content: 'Mane Haus was founded in Toronto.' }],
      });
    }

    // ── Orders ──
    if (url.match(/\/api\/orders\/[^/]+$/) && method === 'GET') {
      return json(route, mockOrders[0]);
    }
    if (url.includes('/api/orders') && method === 'GET') {
      return json(route, mockOrders);
    }

    // ── Newsletter ──
    if (url.includes('/api/newsletter/subscribe') && method === 'POST') {
      return json(route, mockNewsletterResponse, 201);
    }
    if (url.includes('/api/newsletter/confirm')) {
      return json(route, {});
    }
    if (url.includes('/api/newsletter/unsubscribe')) {
      return json(route, {});
    }

    // ── Cart ──
    if (url.includes('/api/cart')) {
      if (method === 'POST') return json(route, { id: 'cart-001', items: [], total: 0 }, 201);
      return json(route, { id: 'cart-001', items: [], total: 0 });
    }

    // ── Chat ──
    if (url.includes('/api/chat')) {
      return json(route, {
        id: 'conv-001',
        messages: [{ role: 'assistant', content: 'Hi! How can I help you today?' }],
      });
    }

    // ── Catch-all ──
    return json(route, {});
  });
}
