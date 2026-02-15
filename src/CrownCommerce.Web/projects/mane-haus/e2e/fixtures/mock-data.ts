// ── Auth ──

export const mockAuthResponse = {
  userId: 'usr-001',
  email: 'test@manehaus.ca',
  firstName: 'Jane',
  lastName: 'Doe',
  token: 'mock-jwt-token-12345',
};

// ── User Profile ──

export const mockUserProfile = {
  userId: 'usr-001',
  email: 'test@manehaus.ca',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '416-555-0123',
  createdAt: '2025-06-15T00:00:00Z',
};

// ── Products ──

export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Brazilian Body Wave',
    originId: 'org-001',
    originCountry: 'Brazil',
    texture: 'Body Wave',
    type: 'Bundles',
    lengthInches: 18,
    description: 'Premium body wave bundles with natural movement and shine.',
    price: 189,
    imageUrl: '/assets/products/body-wave.jpg',
  },
  {
    id: 'prod-002',
    name: 'Peruvian Straight',
    originId: 'org-002',
    originCountry: 'Peru',
    texture: 'Straight',
    type: 'Bundles',
    lengthInches: 20,
    description: 'Silky straight bundles that blend seamlessly with relaxed hair.',
    price: 199,
    imageUrl: '/assets/products/straight.jpg',
  },
  {
    id: 'prod-003',
    name: 'HD Lace Closure',
    originId: 'org-001',
    originCountry: 'Brazil',
    texture: 'Straight',
    type: 'Closures',
    lengthInches: 16,
    description: 'Invisible HD lace closure for a flawless, natural hairline.',
    price: 149,
    imageUrl: '/assets/products/closure.jpg',
  },
];

// ── Testimonials ──

export const mockTestimonials = [
  {
    id: 'test-001',
    content: 'The quality is unmatched. My hair has lasted over a year and still looks amazing!',
    customerName: 'Sarah M.',
    customerLocation: 'Toronto',
    rating: 5,
  },
  {
    id: 'test-002',
    content: 'Best hair I have ever purchased. Minimal shedding and the curls hold beautifully.',
    customerName: 'Michelle R.',
    customerLocation: 'Vancouver',
    rating: 5,
  },
];

// ── Gallery ──

export const mockGalleryImages = [
  {
    id: 'gal-001',
    imageUrl: '/assets/gallery/community-1.jpg',
    caption: 'Community look 1',
    category: 'community',
  },
  {
    id: 'gal-002',
    imageUrl: '/assets/gallery/community-2.jpg',
    caption: 'Community look 2',
    category: 'community',
  },
  {
    id: 'gal-003',
    imageUrl: '/assets/gallery/community-3.jpg',
    caption: 'Community look 3',
    category: 'community',
  },
  {
    id: 'gal-004',
    imageUrl: '/assets/gallery/community-4.jpg',
    caption: 'Community look 4',
    category: 'community',
  },
];

// ── Orders ──

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

// ── Newsletter ──

export const mockNewsletterResponse = {
  email: 'test@example.com',
  subscribedAt: new Date().toISOString(),
};
