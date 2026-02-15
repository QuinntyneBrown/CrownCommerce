import { Page, Route } from '@playwright/test';
import * as data from './mock-data';

function json(route: Route, body: unknown, status = 200): Promise<void> {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

/**
 * Core API mocks for features library services.
 * Apps extend this with their own routes (auth, admin, etc.).
 */
export async function setupFeatureApiMocks(page: Page): Promise<void> {
  await page.route('**/api/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // ── Catalog / Products ──
    if (url.includes('/api/catalog/products') && !url.match(/\/[^/]+$/) && method === 'GET')
      return json(route, data.mockProducts);
    if (url.match(/\/api\/catalog\/products\/[^/]+$/) && method === 'GET')
      return json(route, data.mockProducts[0]);

    // ── Content ──
    if (url.includes('/api/content/testimonials')) return json(route, data.mockTestimonials);
    if (url.includes('/api/content/gallery')) return json(route, data.mockGalleryImages);
    if (url.includes('/api/content/faqs')) return json(route, data.mockFaqs);
    if (url.match(/\/api\/content\/pages\/([^/]+)$/)) {
      const slug = url.match(/\/api\/content\/pages\/([^/]+)$/)?.[1] ?? 'about';
      return json(route, data.mockContentPage(slug));
    }

    // ── Newsletter ──
    if (url.includes('/api/newsletter/subscribe') && method === 'POST')
      return json(route, data.mockNewsletterResponse, 201);
    if (url.includes('/api/newsletter/confirm')) return json(route, {});
    if (url.includes('/api/newsletter/unsubscribe')) return json(route, {});

    // ── Chat ──
    if (url.includes('/api/chat')) return json(route, data.mockChatResponse);

    // ── Orders ──
    if (url.includes('/api/order') && method === 'POST') return json(route, data.mockOrderResponse, 201);
    if (url.includes('/api/order') && method === 'GET') return json(route, data.mockCartItems);

    // ── Payment ──
    if (url.includes('/api/payment') && method === 'POST') return json(route, data.mockPaymentResponse);

    // ── Inquiry ──
    if (url.includes('/api/inquiry') && method === 'POST') return json(route, data.mockInquiryResponse, 201);

    // ── Cart ──
    if (url.includes('/api/cart')) {
      if (method === 'POST') return json(route, { id: 'cart-001', items: [], total: 0 }, 201);
      return json(route, { id: 'cart-001', items: [], total: 0 });
    }

    // ── Catch-all ──
    return json(route, {});
  });
}
