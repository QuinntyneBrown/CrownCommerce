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
    if (url.includes('/api/catalog/products/category/') && method === 'GET') {
      return json(route, { items: data.mockProducts, totalCount: data.mockProducts.length, page: 1, pageSize: 20 });
    }
    if (url.includes('/api/catalog/products') && url.includes('/reviews') && method === 'GET') {
      return json(route, data.mockProductReviews);
    }
    if (url.includes('/api/catalog/products') && url.includes('/related') && method === 'GET') {
      return json(route, data.mockRelatedProducts);
    }
    if (url.includes('/api/catalog/products') && url.includes('/detail') && method === 'GET') {
      return json(route, data.mockProductDetail);
    }
    if (url.includes('/api/catalog/products') && !url.match(/\/[^/]+$/) && method === 'GET')
      return json(route, data.mockProducts);
    if (url.match(/\/api\/catalog\/products\/[^/]+$/) && method === 'GET')
      return json(route, data.mockProducts[0]);

    // ── Bundle Deals ──
    if (url.includes('/api/catalog/bundle-deals') && method === 'GET')
      return json(route, data.mockBundleDeals);

    // ── Content ──
    if (url.includes('/api/content/brand-story')) return json(route, data.mockBrandStory);
    if (url.includes('/api/content/hair-care-guide')) return json(route, data.mockHairCareGuide);
    if (url.includes('/api/content/shipping-policy')) return json(route, data.mockShippingPolicy);
    if (url.includes('/api/content/returns-policy')) return json(route, data.mockReturnsPolicy);
    if (url.includes('/api/content/wholesale-pricing')) return json(route, data.mockWholesaleTiers);
    if (url.includes('/api/content/testimonials')) return json(route, data.mockTestimonials);
    if (url.includes('/api/content/gallery')) return json(route, data.mockGalleryImages);
    if (url.includes('/api/content/faqs')) return json(route, data.mockFaqs);
    if (url.match(/\/api\/content\/pages\/([^/]+)$/)) {
      const slug = url.match(/\/api\/content\/pages\/([^/]+)$/)?.[1] ?? 'about';
      return json(route, data.mockContentPage(slug));
    }

    // ── Ambassador ──
    if (url.includes('/api/ambassador/program') && method === 'GET')
      return json(route, data.mockAmbassadorProgram);
    if (url.includes('/api/ambassador/applications') && method === 'POST')
      return json(route, { id: 'app-001', status: 'received' }, 201);

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
    if (url.includes('/api/inquiries') && method === 'POST') return json(route, data.mockInquiryResponse, 201);

    // ── Cart ──
    if (url.includes('/api/orders/cart')) {
      if (method === 'POST') return json(route, { id: 'cart-001', productId: 'prod-001', productName: 'Virgin Hair Bundles', quantity: 1, unitPrice: 85 }, 201);
      if (method === 'DELETE') return json(route, {});
      return json(route, data.mockCartItems);
    }
    if (url.includes('/api/cart')) {
      if (method === 'POST') return json(route, { id: 'cart-001', items: [], total: 0 }, 201);
      return json(route, { id: 'cart-001', items: [], total: 0 });
    }

    // ── Catch-all ──
    return json(route, {});
  });
}
