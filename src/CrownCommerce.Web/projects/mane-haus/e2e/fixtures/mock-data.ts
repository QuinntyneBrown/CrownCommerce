// Re-export shared mock data as the single source of truth
export {
  mockProducts,
  mockTestimonials,
  mockGalleryImages,
  mockFaqs,
  mockNewsletterResponse,
  mockCartItems,
  mockOrderResponse,
  mockPaymentResponse,
  mockContentPage,
  mockChatResponse,
  mockInquiryResponse,
} from '../../../../e2e-shared/fixtures/mock-data';

// ── Mane Haus-specific mock data ──

export const mockAuthResponse = {
  userId: 'usr-001',
  email: 'test@manehaus.ca',
  firstName: 'Jane',
  lastName: 'Doe',
  token: 'mock-jwt-token-12345',
};

export const mockUserProfile = {
  userId: 'usr-001',
  email: 'test@manehaus.ca',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '416-555-0123',
  createdAt: '2025-06-15T00:00:00Z',
};

export const mockOrders = [
  {
    id: 'ord-001',
    status: 'Delivered',
    totalAmount: 537,
    createdAt: '2025-12-01T10:00:00Z',
    items: [
      {
        id: 'item-001',
        productId: 'prod-001',
        productName: 'Brazilian Body Wave',
        quantity: 2,
        unitPrice: 189,
        totalPrice: 378,
      },
      {
        id: 'item-002',
        productId: 'prod-003',
        productName: 'HD Lace Closure',
        quantity: 1,
        unitPrice: 149,
        totalPrice: 149,
      },
    ],
    shippingAddress: {
      line1: '123 Queen St W',
      city: 'Toronto',
      province: 'Ontario',
      postalCode: 'M5H 2M9',
      country: 'Canada',
    },
  },
];
