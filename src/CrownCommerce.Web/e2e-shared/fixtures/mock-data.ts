// ── Products ──

export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Cambodian Straight Bundle',
    originId: 'org-001',
    originCountry: 'Cambodia',
    category: 'bundles',
    texture: 'Straight',
    type: 'bundle',
    lengthInches: 18,
    description: 'Premium Cambodian straight hair bundle, silky and smooth.',
    price: 185,
    imageUrl: '/assets/products/cambodian-straight.jpg',
    imageUrls: ['/assets/products/cambodian-straight.jpg'],
    rating: 4.8,
    reviewCount: 124,
    availableLengths: [14, 16, 18, 20, 22],
    features: ['100% Virgin Hair', 'Double Wefted', 'Tangle Free'],
    inStock: true,
  },
  {
    id: 'prod-002',
    name: 'Cambodian Wavy Bundle',
    originId: 'org-001',
    originCountry: 'Cambodia',
    category: 'bundles',
    texture: 'Wavy',
    type: 'bundle',
    lengthInches: 20,
    description: 'Natural wave pattern Cambodian hair bundle.',
    price: 210,
    imageUrl: '/assets/products/cambodian-wavy.jpg',
    imageUrls: ['/assets/products/cambodian-wavy.jpg'],
    rating: 4.7,
    reviewCount: 89,
    availableLengths: [14, 16, 18, 20, 22],
    features: ['100% Virgin Hair', 'Natural Wave', 'Minimal Shedding'],
    inStock: true,
  },
  {
    id: 'prod-003',
    name: 'Indonesian Silky Straight Bundle',
    originId: 'org-002',
    originCountry: 'Indonesia',
    category: 'bundles',
    texture: 'Straight',
    type: 'bundle',
    lengthInches: 20,
    description: 'Ultra-silky straight Indonesian hair bundle.',
    price: 195,
    imageUrl: '/assets/products/indonesian-straight.jpg',
    imageUrls: ['/assets/products/indonesian-straight.jpg'],
    rating: 4.9,
    reviewCount: 67,
    availableLengths: [14, 16, 18, 20],
    features: ['Silky Texture', '100% Virgin', 'Color Safe'],
    inStock: true,
  },
];

// ── Product Detail ──

export const mockProductDetail = {
  ...mockProducts[0],
  images: [
    { url: '/assets/products/bundles.jpg', alt: 'Virgin Hair Bundles - Front' },
    { url: '/assets/products/bundles-2.jpg', alt: 'Virgin Hair Bundles - Side' },
  ],
  breadcrumb: [
    { label: 'Home', url: '/' },
    { label: 'Shop', url: '/shop' },
    { label: 'Virgin Hair Bundles', url: '/product/prod-001' },
  ],
};

// ── Product Reviews ──

export const mockProductReviews = {
  items: [
    {
      id: 'rev-001',
      customerName: 'Jasmine T.',
      rating: 5,
      content: 'Amazing quality! The hair is so soft and the texture holds up beautifully after multiple washes.',
      createdAt: '2026-02-10T12:00:00Z',
    },
    {
      id: 'rev-002',
      customerName: 'Aisha M.',
      rating: 4,
      content: 'Great value for the price. The bundles blended perfectly with my natural hair.',
      createdAt: '2026-02-05T12:00:00Z',
    },
    {
      id: 'rev-003',
      customerName: 'Nicole R.',
      rating: 5,
      content: 'This is my third time ordering and the quality is always consistent. Highly recommend!',
      createdAt: '2026-01-28T12:00:00Z',
    },
  ],
  totalCount: 124,
  page: 1,
  pageSize: 3,
};

// ── Related Products ──

export const mockRelatedProducts = [mockProducts[1], mockProducts[2]];

// ── Testimonials ──

export const mockTestimonials = [
  {
    id: 'test-001',
    content:
      "I ordered the Cambodian straight bundles and the quality is unmatched. Silky, no shedding, and it blends perfectly with my natural hair.",
    customerName: 'Sarah M.',
    customerLocation: 'Atlanta',
    rating: 5,
  },
  {
    id: 'test-002',
    content:
      "Origin is different — the quality is unmatched, the texture is beautiful, and it literally lasts forever. I'm never going back.",
    customerName: 'Jasmine T.',
    customerLocation: 'Toronto',
    rating: 5,
  },
  {
    id: 'test-003',
    content:
      "Best hair I've ever purchased. The Indonesian silky straight is absolutely gorgeous and holds up amazing after multiple washes.",
    customerName: 'Nicole R.',
    customerLocation: 'Miami',
    rating: 5,
  },
];

// ── Gallery ──

export const mockGalleryImages = [
  { id: 'gal-001', imageUrl: '/assets/gallery/community-1.jpg', caption: 'Look 1', category: 'community' },
  { id: 'gal-002', imageUrl: '/assets/gallery/community-2.jpg', caption: 'Look 2', category: 'community' },
  { id: 'gal-003', imageUrl: '/assets/gallery/community-3.jpg', caption: 'Look 3', category: 'community' },
  { id: 'gal-004', imageUrl: '/assets/gallery/community-4.jpg', caption: 'Look 4', category: 'community' },
  { id: 'gal-005', imageUrl: '/assets/gallery/community-5.jpg', caption: 'Look 5', category: 'community' },
  { id: 'gal-006', imageUrl: '/assets/gallery/community-6.jpg', caption: 'Look 6', category: 'community' },
  { id: 'gal-007', imageUrl: '/assets/gallery/community-7.jpg', caption: 'Look 7', category: 'community' },
  { id: 'gal-008', imageUrl: '/assets/gallery/community-8.jpg', caption: 'Look 8', category: 'community' },
];

// ── FAQs ──

export const mockFaqs = [
  { id: 'faq-001', question: 'How long does the hair last?', answer: '12+ months with proper care.', category: 'Product' },
  { id: 'faq-002', question: 'Do you offer returns?', answer: 'Yes, within 30 days of purchase.', category: 'Shipping' },
  { id: 'faq-003', question: 'Is the hair ethically sourced?', answer: 'Absolutely. 100% ethical sourcing.', category: 'Product' },
];

// ── Newsletter ──

export const mockNewsletterResponse = {
  email: 'test@example.com',
  subscribedAt: new Date().toISOString(),
};

// ── Cart / Orders ──

export const mockCartItems = [
  { productId: 'prod-001', productName: 'Virgin Hair Bundles', quantity: 2, unitPrice: 85 },
];

export const mockOrderResponse = { orderId: 'ORD-20260215-001', status: 'pending' };
export const mockPaymentResponse = { paymentId: 'PAY-001', status: 'confirmed' };

// ── Content Pages ──

export const mockContentPage = (slug: string) => ({
  slug,
  title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  sections: [{ type: 'text', content: `Content for ${slug} page.` }],
});

// ── Chat ──

export const mockChatResponse = {
  id: 'conv-001',
  messages: [{ role: 'assistant', content: 'Hi! How can I help you today?' }],
};

// ── Inquiry ──

export const mockInquiryResponse = { id: 'inq-001', status: 'received' };

// ── Brand Story ──

export const mockBrandStory = {
  heroImageUrl: '/assets/about/hero.jpg',
  heroTitle: 'Our Story',
  heroSubtitle: 'From humble beginnings to a global movement — this is the story of Origin Hair Collective.',
  founder: {
    name: 'Maya Johnson',
    imageUrl: '/assets/about/founder.jpg',
    bio: 'Maya founded Origin Hair Collective with a vision to make premium quality hair accessible to everyone.',
  },
  mission: {
    title: 'Beauty Without Compromise',
    description: 'We believe in providing the highest quality virgin hair while maintaining ethical sourcing practices.',
  },
  values: [
    { icon: '✦', title: 'Quality First', description: 'Only the finest 100% virgin hair makes it into our collection.' },
    { icon: '♡', title: 'Ethical Sourcing', description: 'Every strand is ethically sourced from trusted suppliers.' },
    { icon: '★', title: 'Community Driven', description: 'We empower women to feel confident and beautiful.' },
  ],
  timeline: [
    { year: '2020', title: 'The Beginning', description: 'Origin Hair Collective was founded in Toronto.' },
    { year: '2022', title: 'Going Global', description: 'Expanded shipping to over 30 countries worldwide.' },
    { year: '2024', title: 'Community First', description: 'Launched our ambassador program with 500+ members.' },
    { year: '2026', title: 'The Future', description: 'Continuing to innovate and grow our community.' },
  ],
  ctaTitle: 'Ready to Experience the Difference?',
  ctaDescription: 'Browse our curated collection of premium virgin hair extensions.',
};

// ── Hair Care Guide ──

export const mockHairCareGuide = {
  heroTitle: 'Hair Care Guide',
  heroSubtitle: 'Everything you need to know to keep your extensions looking flawless.',
  sections: [
    {
      id: 'washing',
      title: 'Washing',
      description: 'How to Wash Your Extensions',
      tips: [
        { icon: '💧', title: 'Use Sulfate-Free Shampoo', description: 'Sulfate-free formulas protect the hair cuticle.' },
        { icon: '🧴', title: 'Condition Regularly', description: 'Deep condition weekly to maintain moisture.' },
        { icon: '🌊', title: 'Rinse with Cool Water', description: 'Cool water seals the cuticle for extra shine.' },
      ],
    },
    {
      id: 'styling',
      title: 'Styling',
      description: 'Styling Tips & Best Practices',
      tips: [
        { icon: '🔥', title: 'Heat Protection', description: 'Always use heat protectant before styling.' },
        { icon: '💨', title: 'Air Dry When Possible', description: 'Minimize heat damage by air drying.' },
        { icon: '✂️', title: 'Trim Regularly', description: 'Trim ends every 6-8 weeks to prevent split ends.' },
      ],
    },
  ],
  ctaTitle: 'Need Personalized Advice?',
  ctaDescription: 'Our stylists are here to help you get the best out of your extensions.',
};

// ── Shipping Policy ──

export const mockShippingPolicy = {
  heroTitle: 'Shipping Information',
  heroSubtitle: 'Fast, reliable shipping across North America and worldwide.',
  zones: [
    { name: 'Standard Domestic', rate: '$5.99', deliveryTime: '5-7 business days' },
    { name: 'Express Domestic', rate: '$14.99', deliveryTime: '2-3 business days' },
    { name: 'International', rate: '$24.99', deliveryTime: '7-14 business days' },
  ],
  processingTime: 'Orders are processed within 1-2 business days.',
  trackingInfo: 'Tracking numbers are emailed once your order ships.',
  processSteps: [
    { stepNumber: 1, title: 'Order Placed', description: 'Your order is confirmed and being prepared.' },
    { stepNumber: 2, title: 'Shipped', description: 'Your order has been dispatched with tracking.' },
    { stepNumber: 3, title: 'Delivered', description: 'Your package arrives at your doorstep.' },
  ],
};

// ── Returns Policy ──

export const mockReturnsPolicy = {
  heroTitle: 'Returns & Exchanges',
  heroSubtitle: 'We want you to be completely satisfied with your purchase.',
  eligibilityWindow: '30 days',
  conditions: [
    { title: 'Unopened Packages', description: 'Items must be in their original, unopened packaging.' },
    { title: '30-Day Window', description: 'Returns must be initiated within 30 days of delivery.' },
    { title: 'Original Receipt', description: 'Proof of purchase is required for all returns.' },
    { title: 'Quality Issues', description: 'Contact us immediately if you receive a defective product.' },
  ],
  processSteps: [
    { stepNumber: 1, title: 'Contact Us', description: 'Email our support team to initiate your return.' },
    { stepNumber: 2, title: 'Ship Your Return', description: 'Send your item back using the provided label.' },
    { stepNumber: 3, title: 'Receive Refund', description: 'Refund processed within 5-7 business days.' },
  ],
  exchangeInfo: 'Exchanges are available for the same product in a different length or texture.',
};

// ── Wholesale Tiers ──

export const mockWholesaleTiers = [
  {
    id: 'tier-001',
    name: 'Starter',
    minimumOrder: 500,
    discount: '15% Off',
    features: ['15% off retail', 'Email support', 'Quarterly catalog'],
    highlighted: false,
  },
  {
    id: 'tier-002',
    name: 'Professional',
    minimumOrder: 2000,
    discount: '25% Off',
    features: ['25% off retail', 'Priority support', 'Monthly catalog', 'Free shipping'],
    highlighted: true,
  },
  {
    id: 'tier-003',
    name: 'Enterprise',
    minimumOrder: 5000,
    discount: '35% Off',
    features: ['35% off retail', 'Dedicated account manager', 'Custom orders', 'Free expedited shipping'],
    highlighted: false,
  },
];

// ── Ambassador Program ──

export const mockAmbassadorProgram = {
  heroTitle: 'Become an Ambassador',
  heroSubtitle: 'Represent the brand you love and earn while doing it.',
  perks: [
    { icon: '💰', title: 'Commission', description: 'Earn 15% commission on every sale you refer.' },
    { icon: '🎁', title: 'Free Products', description: 'Receive free products to create content with.' },
    { icon: '🌟', title: 'Exclusive Access', description: 'Be the first to try new products and collections.' },
    { icon: '📸', title: 'Content Support', description: 'Get professional photos and brand assets.' },
  ],
  howItWorks: [
    { stepNumber: 1, title: 'Apply', description: 'Fill out our simple application form below.' },
    { stepNumber: 2, title: 'Get Approved', description: "We'll review your application within 48 hours." },
    { stepNumber: 3, title: 'Start Earning', description: 'Share your unique link and earn on every sale.' },
  ],
  ctaTitle: 'Ready to Join the Movement?',
  ctaDescription: 'Apply today and start your journey as an Origin ambassador.',
};

// ── Bundle Deals ──

export const mockBundleDeals = [
  {
    id: 'deal-001',
    name: 'Starter Bundle',
    description: '3 bundles of Body Wave hair at a discounted price.',
    items: ['Body Wave 14"', 'Body Wave 16"', 'Body Wave 18"'],
    originalPrice: 255,
    dealPrice: 199,
    savingsAmount: 56,
    savingsLabel: 'SAVE 22%',
    imageUrl: '/assets/deals/starter-bundle.jpg',
  },
  {
    id: 'deal-002',
    name: 'Complete Set',
    description: '3 bundles + closure for a full sew-in install.',
    items: ['Straight 16"', 'Straight 18"', 'Straight 20"', '4x4 Closure 14"'],
    originalPrice: 370,
    dealPrice: 279,
    savingsAmount: 91,
    savingsLabel: 'SAVE 25%',
    imageUrl: '/assets/deals/complete-set.jpg',
  },
  {
    id: 'deal-003',
    name: 'Frontal Bundle',
    description: '3 bundles + frontal for maximum versatility.',
    items: ['Deep Wave 18"', 'Deep Wave 20"', 'Deep Wave 22"', '13x4 Frontal 16"'],
    originalPrice: 420,
    dealPrice: 299,
    savingsAmount: 121,
    savingsLabel: 'SAVE 29%',
    imageUrl: '/assets/deals/frontal-bundle.jpg',
  },
];
