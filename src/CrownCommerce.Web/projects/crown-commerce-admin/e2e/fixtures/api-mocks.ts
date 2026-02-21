import { Page } from '@playwright/test';
import {
  mockProducts,
  mockOrigins,
  mockInquiries,
  mockTestimonials,
  mockTrustBarItems,
  mockHeroContent,
  mockSubscriberStats,
  mockSubscribersPagedResult,
  mockEmployees,
  mockCurrentEmployee,
  mockCalendarEvents,
  mockConversations,
  mockConversationDetail,
  mockAdminUsers,
  mockCustomers,
  mockLeads,
  mockGalleryImages,
  mockFaqs,
  mockContentPages,
  mockCampaignsPagedResult,
  mockOrders,
} from './mock-data';

/**
 * Sets up API route mocks for all admin endpoints.
 *
 * IMPORTANT: In Playwright, routes registered LATER have HIGHER priority.
 * So we register the catch-all/generic routes FIRST (lowest priority)
 * and the most specific routes LAST (highest priority).
 */
export async function setupApiMocks(page: Page): Promise<void> {
  // ── Lowest priority: catch-all and generic routes (registered first) ──

  // Catch-all for any other API calls
  await page.route('**/api/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  // WebSocket mock for notifications
  await page.routeWebSocket('**/ws/notifications', (ws) => {
    ws.onMessage(() => {
      // No-op: will be wired up when real WebSocket is added
    });
  });

  // Notifications
  await page.route('**/api/notifications/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  // Auth / Identity
  await page.route('**/api/identity/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ username: 'quinn', role: 'admin' }),
    });
  });

  // ── Medium priority: list endpoints (registered in middle) ──

  // Products list
  await page.route('**/api/catalog/products**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ...mockProducts[0], id: 'new-product-id' }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProducts),
      });
    }
  });

  // Origins list
  await page.route('**/api/catalog/origins**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'new-origin-id', country: 'Thailand', region: 'Bangkok', description: 'New origin' }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrigins),
      });
    }
  });

  // Inquiries list
  await page.route('**/api/inquiries**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockInquiries),
    });
  });

  // Subscribers list
  await page.route('**/api/newsletters/admin/subscribers**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSubscribersPagedResult),
    });
  });

  // Admin users list
  await page.route('**/api/identity/auth/users**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAdminUsers),
    });
  });

  // CRM customers list
  await page.route('**/api/crm/crm/customers**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockCustomers[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCustomers),
      });
    }
  });

  // CRM leads list
  await page.route('**/api/crm/crm/leads**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockLeads[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLeads),
      });
    }
  });

  // Gallery images list
  await page.route('**/api/content/gallery**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGalleryImages),
    });
  });

  // FAQs list
  await page.route('**/api/content/faqs**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockFaqs),
    });
  });

  // Content pages list
  await page.route('**/api/content/pages**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockContentPages),
    });
  });

  // Newsletter campaigns list
  await page.route('**/api/newsletters/admin/campaigns**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockCampaignsPagedResult.items[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCampaignsPagedResult),
      });
    }
  });

  // Orders list
  await page.route('**/api/orders/orders**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOrders),
    });
  });

  // Newsletter public endpoints
  await page.route('**/api/newsletters/subscribe', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Subscribed' }),
    });
  });

  // Scheduling: employees list
  await page.route('**/api/scheduling/employees**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockEmployees),
    });
  });

  // Scheduling: meetings list / create
  await page.route('**/api/scheduling/meetings**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'new-meeting-id', title: 'New Meeting', attendees: [] }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    }
  });

  // Scheduling: conversations list / create
  await page.route('**/api/scheduling/conversations**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockConversationDetail),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConversations),
      });
    }
  });

  // Testimonials list / create
  await page.route('**/api/content/testimonials**', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'new-testimonial' }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTestimonials),
      });
    }
  });

  // Hero content
  await page.route('**/api/content/hero**', (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...mockHeroContent, title: 'Updated Title' }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockHeroContent),
      });
    }
  });

  // Trust bar
  await page.route('**/api/content/trust-bar**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockTrustBarItems),
    });
  });

  // ── Highest priority: specific/single-resource routes (registered last) ──

  // Products (single product)
  await page.route('**/api/catalog/products/*', (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProducts[0]),
      });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProducts[0]),
      });
    } else if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fallback();
    }
  });

  // Origins (single origin)
  await page.route('**/api/catalog/origins/*', (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrigins[0]),
      });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...mockOrigins[0], description: 'Updated description' }),
      });
    } else if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fallback();
    }
  });

  // Inquiries (single - delete)
  await page.route('**/api/inquiries/inquiries/*', (route) => {
    if (route.request().method() === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fallback();
    }
  });

  // Subscriber stats (specific endpoint, higher priority than subscribers list)
  await page.route('**/api/newsletters/admin/subscribers/stats', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSubscriberStats),
    });
  });

  // Subscriber single (delete)
  await page.route(/\/api\/newsletters\/admin\/subscribers\/[^/]+$/, (route) => {
    if (route.request().method() === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fallback();
    }
  });

  // Scheduling: employees/me (must have higher priority than employees/*)
  await page.route('**/api/scheduling/employees/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCurrentEmployee),
    });
  });

  // Scheduling: single employee
  await page.route(/\/api\/scheduling\/employees\/(?!me)[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockEmployees[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockEmployees[0]),
      });
    }
  });

  // Scheduling: meeting actions (cancel, ical)
  await page.route(/\/api\/scheduling\/meetings\/[^/]+\/(cancel|ical)/, (route) => {
    if (route.request().url().includes('/ical')) {
      route.fulfill({
        status: 200,
        contentType: 'text/calendar',
        body: 'BEGIN:VCALENDAR\nEND:VCALENDAR',
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    }
  });

  // Scheduling: calendar events
  await page.route('**/api/scheduling/meetings/calendar**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCalendarEvents),
    });
  });

  // Scheduling: single meeting
  await page.route(/\/api\/scheduling\/meetings\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'mtg-1', title: 'Updated Meeting' }),
      });
    } else if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'mtg-1', title: 'Weekly Sync', attendees: [] }),
      });
    }
  });

  // Scheduling: conversation messages
  await page.route('**/api/scheduling/conversations/*/messages', (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'new-msg', senderEmployeeId: 'emp-1', content: 'New message', sentAt: new Date().toISOString() }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConversationDetail.messages),
      });
    }
  });

  // Scheduling: single conversation
  await page.route(/\/api\/scheduling\/conversations\/[^/]+$/, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockConversationDetail),
    });
  });

  // Testimonials (single)
  await page.route(/\/api\/content\/testimonials\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-1' }),
      });
    } else if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fallback();
    }
  });

  // Admin user single (GET, DELETE, PUT role)
  await page.route(/\/api\/identity\/auth\/users\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAdminUsers[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAdminUsers[0]),
      });
    }
  });

  // CRM customer single
  await page.route(/\/api\/crm\/crm\/customers\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCustomers[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCustomers[0]),
      });
    }
  });

  // CRM lead single
  await page.route(/\/api\/crm\/crm\/leads\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLeads[0]),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLeads[0]),
      });
    }
  });

  // Gallery image single
  await page.route(/\/api\/content\/gallery\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGalleryImages[0]),
      });
    } else {
      route.fallback();
    }
  });

  // FAQ single
  await page.route(/\/api\/content\/faqs\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFaqs[0]),
      });
    } else {
      route.fallback();
    }
  });

  // Content page single
  await page.route(/\/api\/content\/pages\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else if (method === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockContentPages[0]),
      });
    } else {
      route.fallback();
    }
  });

  // Campaign actions (send, cancel) - must be higher priority than single campaign
  await page.route(/\/api\/newsletters\/admin\/campaigns\/[^/]+\/(send|cancel)$/, (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
  });

  // Campaign single (GET, DELETE)
  await page.route(/\/api\/newsletters\/admin\/campaigns\/[^/]+$/, (route) => {
    const method = route.request().method();
    if (method === 'DELETE') {
      route.fulfill({ status: 204, body: '' });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCampaignsPagedResult.items[0]),
      });
    }
  });

  // Order status update
  await page.route(/\/api\/orders\/orders\/[^/]+\/status$/, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOrders[0]),
    });
  });
}

/** Mock for POST /api/catalog/products (create product) */
export async function setupProductCreateMock(page: Page): Promise<void> {
  await page.route('**/api/catalog/products', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ...mockProducts[0], id: 'new-product-id' }),
      });
    } else {
      route.fallback();
    }
  });
}

/** Mock for PUT /api/content/hero (save hero content) */
export async function setupHeroContentSaveMock(page: Page): Promise<void> {
  await page.route('**/api/content/hero', (route) => {
    if (route.request().method() === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...mockHeroContent, title: 'Updated Title' }),
      });
    } else {
      route.fallback();
    }
  });
}
