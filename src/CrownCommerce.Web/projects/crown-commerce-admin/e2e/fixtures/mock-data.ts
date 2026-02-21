// ── Interfaces (matching actual API models) ──

export interface MetricCardInfo {
  label: string;
  value: string;
  change: string;
}

export interface RecentProductInfo {
  name: string;
  type: string;
  price: string;
  origin: string;
}

export interface RecentInquiryInfo {
  initials: string;
  name: string;
  message: string;
  time: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  originId: string;
  originCountry: string;
  texture: string;
  type: string;
  lengthInches: number;
  price: number;
  description: string;
  imageUrl: string | null;
}

export interface OriginInfo {
  id: string;
  country: string;
  region: string;
  description: string;
}

export interface InquiryInfo {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  productId: string | null;
  createdAt: string;
}

export interface TestimonialInfo {
  id: string;
  customerName: string;
  customerLocation: string | null;
  content: string;
  rating: number;
  imageUrl: string | null;
  createdAt: string;
}

export interface TrustBarItemInfo {
  icon: string;
  label: string;
  description: string;
  order: number;
  status: string;
}

export interface HeroContentInfo {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export interface UserInfo {
  initials: string;
  name: string;
  role: string;
}

// ── Mock Data ──

// Dashboard metrics are computed from data lengths, these are what we expect based on mock data counts
export const mockMetrics: MetricCardInfo[] = [
  { label: 'Total Products', value: '5', change: 'inventory_2' },
  { label: 'Active Inquiries', value: '4', change: 'mail' },
  { label: 'Hair Origins', value: '5', change: 'public' },
  { label: 'Testimonials', value: '3', change: 'star' },
];

// Recent products shown on dashboard (first 4 from mockProducts)
// The dashboard uses `row.price | currency` and `row.originCountry`
export const mockRecentProducts: RecentProductInfo[] = [
  { name: 'Cambodian Straight Bundle', type: 'Bundle', price: '$185.00', origin: 'Cambodia' },
  { name: 'Indian Curly Bundle', type: 'Bundle', price: '$175.00', origin: 'India' },
  { name: 'Vietnamese Wavy Wig', type: 'Wig', price: '$450.00', origin: 'Vietnam' },
  { name: 'Indonesian Body Wave', type: 'Bundle', price: '$210.00', origin: 'Indonesia' },
];

// Recent inquiries shown on dashboard
// The dashboard uses `date:'shortDate'` pipe for the time
export const mockRecentInquiries: RecentInquiryInfo[] = [
  { initials: 'SR', name: 'Sarah Robinson', message: 'Interested in Cambodian bundles', time: '2/8/25' },
  { initials: 'MT', name: 'Maya Thompson', message: 'Question about wig customization', time: '2/7/25' },
  { initials: 'JC', name: 'Jessica Chen', message: 'Bulk order pricing for salon', time: '2/6/25' },
  { initials: 'AW', name: 'Aisha Williams', message: 'Shipping timeline for frontals', time: '2/5/25' },
];

export const mockProducts: ProductInfo[] = [
  { id: 'prod-1', name: 'Cambodian Straight Bundle', originId: 'origin-1', originCountry: 'Cambodia', texture: 'Straight', type: 'Bundle', lengthInches: 18, price: 185.00, description: 'Premium straight bundle from Cambodia', imageUrl: null },
  { id: 'prod-2', name: 'Indian Curly Bundle', originId: 'origin-2', originCountry: 'India', texture: 'Curly', type: 'Bundle', lengthInches: 24, price: 175.00, description: 'Naturally curly temple hair', imageUrl: null },
  { id: 'prod-3', name: 'Vietnamese Wavy Wig', originId: 'origin-3', originCountry: 'Vietnam', texture: 'Wavy', type: 'Wig', lengthInches: 20, price: 450.00, description: 'Premium wavy wig', imageUrl: null },
  { id: 'prod-4', name: 'Indonesian Body Wave', originId: 'origin-4', originCountry: 'Indonesia', texture: 'Wavy', type: 'Bundle', lengthInches: 22, price: 210.00, description: 'Silky body wave bundle', imageUrl: null },
  { id: 'prod-5', name: 'Myanmar Kinky Closure', originId: 'origin-5', originCountry: 'Myanmar', texture: 'Kinky', type: 'Closure', lengthInches: 16, price: 130.00, description: 'Natural kinky closure', imageUrl: null },
];

export const mockOrigins: OriginInfo[] = [
  { id: 'origin-1', country: 'Cambodia', region: 'Phnom Penh', description: 'Naturally thick, durable hair' },
  { id: 'origin-2', country: 'India', region: 'Chennai, Tamil Nadu', description: 'Versatile, temple-sourced hair' },
  { id: 'origin-3', country: 'Vietnam', region: 'Ho Chi Minh City', description: 'Strong, naturally straight hair' },
  { id: 'origin-4', country: 'Indonesia', region: 'Jakarta', description: 'Silky texture, slight wave' },
  { id: 'origin-5', country: 'Myanmar', region: 'Yangon', description: 'Soft, lightweight hair' },
];

export const mockInquiries: InquiryInfo[] = [
  { id: 'inq-1', name: 'Sarah Robinson', email: 'sarah.r@email.com', phone: '(416) 555-0123', message: 'Interested in Cambodian bundles', productId: null, createdAt: '2025-02-08T10:00:00Z' },
  { id: 'inq-2', name: 'Maya Thompson', email: 'maya.t@email.com', phone: '(905) 555-0456', message: 'Question about wig customization', productId: null, createdAt: '2025-02-07T14:00:00Z' },
  { id: 'inq-3', name: 'Jessica Chen', email: 'jessica.c@salon.com', phone: '(647) 555-0789', message: 'Bulk order pricing for salon', productId: null, createdAt: '2025-02-06T09:00:00Z' },
  { id: 'inq-4', name: 'Aisha Williams', email: 'aisha.w@email.com', phone: '(416) 555-0321', message: 'Shipping timeline for frontals', productId: null, createdAt: '2025-02-05T16:00:00Z' },
];

export const mockTestimonials: TestimonialInfo[] = [
  { id: 'test-1', customerName: 'Keisha Brown', customerLocation: 'Toronto', content: "Best quality hair I've ever purchased!", rating: 5, imageUrl: null, createdAt: '2025-02-05T10:00:00Z' },
  { id: 'test-2', customerName: 'Tamara Davis', customerLocation: 'Atlanta', content: 'Love the natural look and feel!', rating: 4.5, imageUrl: null, createdAt: '2025-02-03T14:00:00Z' },
  { id: 'test-3', customerName: 'Nicole James', customerLocation: null, content: 'Amazing customer service and fast shipping', rating: 5, imageUrl: null, createdAt: '2025-01-28T09:00:00Z' },
];

export const mockTrustBarItems: TrustBarItemInfo[] = [
  { icon: 'verified', label: '100% Virgin Hair', description: 'Ethically sourced, unprocessed hair', order: 1, status: 'Active' },
  { icon: 'local_shipping', label: 'Free Shipping', description: 'Free shipping on orders over $150', order: 2, status: 'Active' },
  { icon: 'support_agent', label: '24/7 Support', description: 'Customer support via chat and email', order: 3, status: 'Active' },
  { icon: 'lock', label: 'Secure Payments', description: 'SSL encrypted checkout process', order: 4, status: 'Active' },
];

export const mockHeroContent: HeroContentInfo = {
  title: 'Premium Hair',
  subtitle: 'Ethically sourced, premium quality',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  imageUrl: '',
};

export const mockUser: UserInfo = {
  initials: 'QM',
  name: 'Quinn M.',
  role: 'Administrator',
};

// Actual nav items from the AdminLayout component (12 items)
export const navItems = [
  { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { label: 'Products', route: '/products', icon: 'inventory_2' },
  { label: 'Origins', route: '/origins', icon: 'public' },
  { label: 'Inquiries', route: '/inquiries', icon: 'mail' },
  { label: 'Testimonials', route: '/testimonials', icon: 'star' },
  { label: 'Subscribers', route: '/subscribers', icon: 'group' },
  { label: 'Employees', route: '/employees', icon: 'people' },
  { label: 'Schedule', route: '/schedule', icon: 'calendar_month' },
  { label: 'Book Meeting', route: '/meetings/new', icon: 'event' },
  { label: 'Conversations', route: '/conversations', icon: 'forum' },
  { label: 'Hero Content', route: '/hero-content', icon: 'view_carousel' },
  { label: 'Trust Bar', route: '/trust-bar', icon: 'verified' },
  { label: 'Users', route: '/users', icon: 'admin_panel_settings' },
  { label: 'Customers', route: '/customers', icon: 'contacts' },
  { label: 'Leads', route: '/leads', icon: 'trending_up' },
  { label: 'Gallery', route: '/gallery', icon: 'photo_library' },
  { label: 'FAQs', route: '/faqs', icon: 'quiz' },
  { label: 'Pages', route: '/content-pages', icon: 'article' },
  { label: 'Campaigns', route: '/campaigns', icon: 'campaign' },
  { label: 'Orders', route: '/orders', icon: 'receipt_long' },
];

// Product form expects "Country - Region" format options from origins API
export const productFormOrigins = ['Cambodia - Phnom Penh', 'India - Chennai, Tamil Nadu', 'Vietnam - Ho Chi Minh City', 'Indonesia - Jakarta', 'Myanmar - Yangon'];
export const productFormTextures = ['Straight', 'Curly', 'Wavy', 'Kinky', 'Body Wave'];
export const productFormTypes = ['Bundle', 'Wig', 'Closure', 'Frontal'];

// ── Subscriber Interfaces & Data ──

export interface SubscriberInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  tags: string[];
  confirmedAt: string | null;
  createdAt: string;
  unsubscribedAt: string | null;
}

export interface SubscriberStatsInfo {
  totalActive: number;
  totalPending: number;
  totalUnsubscribed: number;
  recentSubscribers: number;
}

export const mockSubscribers: SubscriberInfo[] = [
  { id: 'sub-1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Johnson', status: 'Active', tags: ['origin-coming-soon'], confirmedAt: '2025-02-01T10:00:00Z', createdAt: '2025-01-28T09:00:00Z', unsubscribedAt: null },
  { id: 'sub-2', email: 'bob@example.com', firstName: 'Bob', lastName: 'Smith', status: 'Active', tags: ['mane-haus-coming-soon'], confirmedAt: '2025-02-02T11:00:00Z', createdAt: '2025-01-30T08:00:00Z', unsubscribedAt: null },
  { id: 'sub-3', email: 'carol@example.com', firstName: 'Carol', lastName: 'Davis', status: 'Pending', tags: ['origin-coming-soon'], confirmedAt: null, createdAt: '2025-02-05T14:00:00Z', unsubscribedAt: null },
  { id: 'sub-4', email: 'dave@example.com', firstName: 'Dave', lastName: 'Wilson', status: 'Unsubscribed', tags: ['mane-haus-coming-soon'], confirmedAt: '2025-01-15T10:00:00Z', createdAt: '2025-01-10T09:00:00Z', unsubscribedAt: '2025-02-01T16:00:00Z' },
];

export const mockSubscriberStats: SubscriberStatsInfo = {
  totalActive: 42,
  totalPending: 8,
  totalUnsubscribed: 3,
  recentSubscribers: 12,
};

export const mockSubscribersPagedResult = {
  items: mockSubscribers,
  totalCount: 53,
  page: 1,
  pageSize: 20,
};

// ── Employee Interfaces & Data ──

export interface EmployeeInfo {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string;
  department: string | null;
  timeZone: string;
  status: string;
  presence: string;
  lastSeenAt: string | null;
  createdAt: string;
}

export const mockEmployees: EmployeeInfo[] = [
  { id: 'emp-1', userId: 'user-1', email: 'quinn@crowncommerce.com', firstName: 'Quinn', lastName: 'Mitchell', phone: '+1-555-0101', jobTitle: 'CEO', department: 'Executive', timeZone: 'America/New_York', status: 'Active', presence: 'Online', lastSeenAt: '2025-02-10T10:00:00Z', createdAt: '2024-06-01T00:00:00Z' },
  { id: 'emp-2', userId: 'user-2', email: 'grace@crowncommerce.com', firstName: 'Grace', lastName: 'Ochieng', phone: '+254-700-1234', jobTitle: 'Supply Chain Manager', department: 'Operations', timeZone: 'Africa/Nairobi', status: 'Active', presence: 'Offline', lastSeenAt: '2025-02-09T18:00:00Z', createdAt: '2024-07-15T00:00:00Z' },
  { id: 'emp-3', userId: 'user-3', email: 'maya@crowncommerce.com', firstName: 'Maya', lastName: 'Patel', phone: null, jobTitle: 'Stylist', department: 'Creative', timeZone: 'America/Los_Angeles', status: 'OnLeave', presence: 'Away', lastSeenAt: '2025-02-05T12:00:00Z', createdAt: '2024-09-01T00:00:00Z' },
];

export const mockCurrentEmployee: EmployeeInfo = mockEmployees[0];

// ── Calendar Event & Meeting Data ──

export interface CalendarEventInfo {
  id: string;
  title: string;
  startTimeUtc: string;
  endTimeUtc: string;
  location: string | null;
  joinUrl: string | null;
  status: string;
  attendeeCount: number;
  organizerName: string;
}

export const mockCalendarEvents: CalendarEventInfo[] = [
  { id: 'evt-1', title: 'Weekly Supply Chain Sync', startTimeUtc: '2025-02-17T14:00:00Z', endTimeUtc: '2025-02-17T15:00:00Z', location: 'Conference Room A', joinUrl: null, status: 'Scheduled', attendeeCount: 3, organizerName: 'Quinn Mitchell' },
  { id: 'evt-2', title: 'Product Photo Review', startTimeUtc: '2025-02-18T16:00:00Z', endTimeUtc: '2025-02-18T17:00:00Z', location: null, joinUrl: 'https://meet.example.com/abc', status: 'Scheduled', attendeeCount: 2, organizerName: 'Maya Patel' },
  { id: 'evt-3', title: 'Q1 Planning', startTimeUtc: '2025-02-20T13:00:00Z', endTimeUtc: '2025-02-20T14:30:00Z', location: 'Board Room', joinUrl: null, status: 'InProgress', attendeeCount: 5, organizerName: 'Quinn Mitchell' },
];

// ── Conversation Data ──

export interface ConversationSummaryInfo {
  id: string;
  subject: string;
  meetingId: string | null;
  status: string;
  createdByEmployeeId: string;
  createdAt: string;
  lastMessageAt: string | null;
  messageCount: number;
  participantCount: number;
}

export interface ConversationMessageInfo {
  id: string;
  senderEmployeeId: string;
  content: string;
  sentAt: string;
}

export interface ConversationDetailInfo {
  id: string;
  subject: string;
  meetingId: string | null;
  status: string;
  createdByEmployeeId: string;
  createdAt: string;
  lastMessageAt: string | null;
  messages: ConversationMessageInfo[];
  participants: { employeeId: string; joinedAt: string }[];
}

export const mockConversations: ConversationSummaryInfo[] = [
  { id: 'conv-1', subject: 'Cambodia Shipment Delay', meetingId: null, status: 'Active', createdByEmployeeId: 'emp-1', createdAt: '2025-02-08T10:00:00Z', lastMessageAt: '2025-02-10T09:30:00Z', messageCount: 5, participantCount: 2 },
  { id: 'conv-2', subject: 'New Product Launch Plan', meetingId: 'evt-1', status: 'Active', createdByEmployeeId: 'emp-2', createdAt: '2025-02-06T14:00:00Z', lastMessageAt: '2025-02-09T16:00:00Z', messageCount: 8, participantCount: 3 },
];

export const mockConversationDetail: ConversationDetailInfo = {
  id: 'conv-1',
  subject: 'Cambodia Shipment Delay',
  meetingId: null,
  status: 'Active',
  createdByEmployeeId: 'emp-1',
  createdAt: '2025-02-08T10:00:00Z',
  lastMessageAt: '2025-02-10T09:30:00Z',
  messages: [
    { id: 'msg-1', senderEmployeeId: 'emp-1', content: 'Heads up, the Cambodia shipment is delayed by 3 days.', sentAt: '2025-02-08T10:00:00Z' },
    { id: 'msg-2', senderEmployeeId: 'emp-2', content: 'Thanks for the update. I will notify the warehouse team.', sentAt: '2025-02-08T10:15:00Z' },
  ],
  participants: [
    { employeeId: 'emp-1', joinedAt: '2025-02-08T10:00:00Z' },
    { employeeId: 'emp-2', joinedAt: '2025-02-08T10:00:00Z' },
  ],
};

// navItemsExtended is kept as alias for backward compatibility
export const navItemsExtended = navItems;

// ── Admin User Interfaces & Data ──

export interface AdminUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

export const mockAdminUsers: AdminUserInfo[] = [
  { id: 'user-1', email: 'quinn@crowncommerce.com', firstName: 'Quinn', lastName: 'Mitchell', phone: '+1-555-0101', role: 'admin', createdAt: '2024-06-01T00:00:00Z' },
  { id: 'user-2', email: 'grace@crowncommerce.com', firstName: 'Grace', lastName: 'Ochieng', phone: '+254-700-1234', role: 'editor', createdAt: '2024-07-15T00:00:00Z' },
  { id: 'user-3', email: 'maya@crowncommerce.com', firstName: 'Maya', lastName: 'Patel', phone: null, role: 'viewer', createdAt: '2024-09-01T00:00:00Z' },
];

// ── Customer Interfaces & Data ──

export interface CustomerInfo {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  tier: string;
  brand: string | null;
  totalOrders: number;
  totalSpent: number;
  firstPurchaseDate: string | null;
  lastPurchaseDate: string | null;
  createdAt: string;
  tags: string[];
}

export const mockCustomers: CustomerInfo[] = [
  { id: 'cust-1', name: 'Keisha Brown', email: 'keisha@email.com', phone: '+1-555-0201', status: 'Active', tier: 'VIP', brand: 'OriginHairCollective', totalOrders: 12, totalSpent: 2400, firstPurchaseDate: '2024-03-15T00:00:00Z', lastPurchaseDate: '2025-02-01T00:00:00Z', createdAt: '2024-03-15T00:00:00Z', tags: ['loyal'] },
  { id: 'cust-2', name: 'Tamara Davis', email: 'tamara@email.com', phone: '+1-555-0202', status: 'Active', tier: 'Standard', brand: 'ManeHaus', totalOrders: 3, totalSpent: 450, firstPurchaseDate: '2024-09-01T00:00:00Z', lastPurchaseDate: '2025-01-15T00:00:00Z', createdAt: '2024-09-01T00:00:00Z', tags: [] },
  { id: 'cust-3', name: 'Nicole James', email: 'nicole@email.com', phone: null, status: 'Inactive', tier: 'Elite', brand: null, totalOrders: 25, totalSpent: 8500, firstPurchaseDate: '2023-06-01T00:00:00Z', lastPurchaseDate: '2024-11-20T00:00:00Z', createdAt: '2023-06-01T00:00:00Z', tags: ['wholesale'] },
];

// ── Lead Interfaces & Data ──

export interface LeadInfo {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string | null;
  source: string;
  leadStatus: string;
  estimatedAnnualRevenue: number;
  industry: string | null;
  createdAt: string;
  qualifiedDate: string | null;
  tags: string[];
}

export const mockLeads: LeadInfo[] = [
  { id: 'lead-1', name: 'Sarah Robinson', company: 'Luxe Salon', email: 'sarah@luxesalon.com', phone: '+1-555-0301', source: 'Website', leadStatus: 'New', estimatedAnnualRevenue: 50000, industry: 'Beauty', createdAt: '2025-02-10T00:00:00Z', qualifiedDate: null, tags: [] },
  { id: 'lead-2', name: 'Marcus Johnson', company: 'Style Studio', email: 'marcus@stylestudio.com', phone: '+1-555-0302', source: 'Referral', leadStatus: 'Qualified', estimatedAnnualRevenue: 120000, industry: 'Retail', createdAt: '2025-01-20T00:00:00Z', qualifiedDate: '2025-02-05T00:00:00Z', tags: ['high-value'] },
  { id: 'lead-3', name: 'Aisha Williams', company: 'Crown Beauty', email: 'aisha@crownbeauty.com', phone: null, source: 'TradeShow', leadStatus: 'Won', estimatedAnnualRevenue: 200000, industry: 'Distribution', createdAt: '2024-11-15T00:00:00Z', qualifiedDate: '2025-01-10T00:00:00Z', tags: ['wholesale', 'priority'] },
];

// ── Gallery Image Interfaces & Data ──

export interface GalleryImageInfo {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export const mockGalleryImages: GalleryImageInfo[] = [
  { id: 'gal-1', title: 'Cambodian Straight Bundle', description: 'Premium straight hair', imageUrl: 'https://example.com/img1.jpg', category: 'Products', createdAt: '2025-01-15T00:00:00Z' },
  { id: 'gal-2', title: 'Salon Transformation', description: 'Before and after styling', imageUrl: 'https://example.com/img2.jpg', category: 'Transformations', createdAt: '2025-01-20T00:00:00Z' },
  { id: 'gal-3', title: 'Team Photo', description: null, imageUrl: 'https://example.com/img3.jpg', category: 'Behind the Scenes', createdAt: '2025-02-01T00:00:00Z' },
];

// ── FAQ Interfaces & Data ──

export interface FaqInfo {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const mockFaqs: FaqInfo[] = [
  { id: 'faq-1', question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days within the US. International orders may take 7-14 business days depending on the destination.', category: 'Shipping' },
  { id: 'faq-2', question: 'What is your return policy?', answer: 'We accept returns within 30 days of purchase for unused items in original packaging. Custom orders are non-refundable.', category: 'Returns' },
  { id: 'faq-3', question: 'How do I care for my hair extensions?', answer: 'Wash with sulfate-free shampoo, condition regularly, and avoid excessive heat styling. Store in a silk bag when not in use.', category: 'Care' },
];

// ── Content Page Interfaces & Data ──

export interface ContentPageInfo {
  id: string;
  slug: string;
  title: string;
  body: string;
  createdAt: string;
}

export const mockContentPages: ContentPageInfo[] = [
  { id: 'page-1', slug: 'about-us', title: 'About Us', body: 'Crown Commerce is a premium hair brand...', createdAt: '2024-06-01T00:00:00Z' },
  { id: 'page-2', slug: 'privacy-policy', title: 'Privacy Policy', body: 'Your privacy is important to us...', createdAt: '2024-06-01T00:00:00Z' },
  { id: 'page-3', slug: 'terms-of-service', title: 'Terms of Service', body: 'By using our website, you agree to these terms...', createdAt: '2024-06-01T00:00:00Z' },
];

// ── Campaign Interfaces & Data ──

export interface CampaignInfo {
  id: string;
  subject: string;
  status: string;
  targetTag: string | null;
  totalRecipients: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export const mockCampaigns: CampaignInfo[] = [
  { id: 'camp-1', subject: 'Spring Sale Launch', status: 'Draft', targetTag: 'origin-coming-soon', totalRecipients: 0, totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalUnsubscribed: 0, scheduledAt: null, sentAt: null, createdAt: '2025-02-10T00:00:00Z' },
  { id: 'camp-2', subject: 'Welcome to Crown Commerce', status: 'Sent', targetTag: null, totalRecipients: 150, totalSent: 148, totalOpened: 89, totalClicked: 42, totalBounced: 2, totalUnsubscribed: 1, scheduledAt: null, sentAt: '2025-01-15T10:00:00Z', createdAt: '2025-01-10T00:00:00Z' },
  { id: 'camp-3', subject: 'Valentine\'s Day Special', status: 'Scheduled', targetTag: 'mane-haus-coming-soon', totalRecipients: 200, totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0, totalUnsubscribed: 0, scheduledAt: '2025-02-14T08:00:00Z', sentAt: null, createdAt: '2025-02-05T00:00:00Z' },
];

export const mockCampaignsPagedResult = {
  items: mockCampaigns,
  totalCount: 3,
  page: 1,
  pageSize: 20,
};

// ── Order Interfaces & Data ──

export interface OrderItemInfo {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderInfo {
  id: string;
  userId: string | null;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  trackingNumber: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemInfo[];
}

export const mockOrders: OrderInfo[] = [
  { id: 'ord-1', userId: 'user-1', customerEmail: 'keisha@email.com', customerName: 'Keisha Brown', shippingAddress: '123 Main St, Toronto, ON', trackingNumber: null, status: 'Pending', totalAmount: 370, createdAt: '2025-02-10T00:00:00Z', items: [{ id: 'item-1', productId: 'prod-1', productName: 'Cambodian Straight Bundle', quantity: 2, unitPrice: 185, lineTotal: 370 }] },
  { id: 'ord-2', userId: 'user-2', customerEmail: 'tamara@email.com', customerName: 'Tamara Davis', shippingAddress: '456 Oak Ave, Atlanta, GA', trackingNumber: 'TRK-123456', status: 'Shipped', totalAmount: 450, createdAt: '2025-02-05T00:00:00Z', items: [{ id: 'item-2', productId: 'prod-3', productName: 'Vietnamese Wavy Wig', quantity: 1, unitPrice: 450, lineTotal: 450 }] },
  { id: 'ord-3', userId: null, customerEmail: 'nicole@email.com', customerName: 'Nicole James', shippingAddress: '789 Pine Rd, New York, NY', trackingNumber: 'TRK-789012', status: 'Delivered', totalAmount: 210, createdAt: '2025-01-28T00:00:00Z', items: [{ id: 'item-3', productId: 'prod-4', productName: 'Indonesian Body Wave', quantity: 1, unitPrice: 210, lineTotal: 210 }] },
];
