# Origin Hair Collective - Pre-Launch Completion Checklist

**Derived from:** `docs/origin-hair-collective-audit.md` (February 15, 2026)
**Total Items:** 126

---

## Phase 1: Connect Backend (Prerequisites)

### 1.1 API Configuration

- [x] Create `src/environments/environment.ts` with `apiBaseUrl: 'http://localhost:5000'`
- [x] Create `src/environments/environment.production.ts` with `apiBaseUrl: 'https://api.originhair.com'`
- [x] Import `provideApi` from `'api'` in `app.config.ts`
- [x] Import `environment` from `'../environments/environment'` in `app.config.ts`
- [x] Call `provideApi({ baseUrl: environment.apiBaseUrl })` in the `providers` array of `app.config.ts`
- [x] Verify `HttpClient` is now available via dependency injection across the app
- [x] Verify `authInterceptor` is registered and attaching Bearer tokens to requests

### 1.2 Security Configuration

- [x] Replace dev JWT secret (`CrownCommerce-Dev-Secret-Key-Min-32-Chars!`) with a cryptographically secure production key in `Services/Identity/.../appsettings.json` *(created appsettings.Production.json with placeholder — manual config needed)*
- [x] Store production JWT secret in Azure Key Vault or environment variable (not in source code) *(placeholder in appsettings.Production.json — manual config needed)*
- [x] Configure `Jwt:Issuer` and `Jwt:Audience` for production in Identity service appsettings

### 1.3 Verify Backend Endpoints

- [x] Verify backend POST endpoint exists for `CatalogService.createProduct()` (catalog.service.ts line 24)
- [x] Verify backend PUT endpoint exists for `CatalogService.updateProduct()` (catalog.service.ts line 29)
- [x] Verify backend POST endpoint exists for `CatalogService.createOrigin()` (catalog.service.ts line 42)
- [x] Verify backend PUT endpoint exists for `CatalogService.updateOrigin()` (catalog.service.ts line 47)
- [x] Verify backend DELETE endpoint exists for `CatalogService.deleteProduct()` (catalog.service.ts line 52)
- [x] Verify backend DELETE endpoint exists for `CatalogService.deleteOrigin()` (catalog.service.ts line 57)
- [x] Verify backend PUT endpoint exists for `ContentService.updateTestimonial()` (content.service.ts line 20)
- [x] Verify backend DELETE endpoint exists for `ContentService.deleteTestimonial()` (content.service.ts line 49)
- [x] Verify backend DELETE endpoint exists for `InquiryService.deleteInquiry()` (inquiry.service.ts line 20)
- [x] Remove TODO comments from service files once endpoints are verified

---

## Phase 2: Replace Hardcoded Data with Backend Calls

### 2.1 Products (home.html lines 42-64)

- [ ] Import `CatalogService` in `HomePage` component
- [ ] Add `products` signal to `HomePage` to hold fetched product data
- [ ] Call `CatalogService.getProducts()` in `ngOnInit()` and populate the signal
- [ ] Replace 3 hardcoded `<lib-product-card>` elements with `@for` loop over products signal
- [ ] Map `HairProduct` model fields to `ProductCardComponent` inputs (`name` -> `title`, `price`, `description`, `imageUrl`)
- [ ] Remove hardcoded Unsplash product image URL for Virgin Hair Bundles (`home.html` line 43)
- [ ] Remove hardcoded Unsplash product image URL for Lace Closures (`home.html` line 50)
- [ ] Remove hardcoded Unsplash product image URL for Lace Frontals (`home.html` line 58)
- [ ] Add loading state while products fetch
- [ ] Add error state if products fetch fails

### 2.2 Testimonials (home.html lines 92-95)

- [ ] Import `ContentService` in `HomePage` component (or reuse if already imported)
- [ ] Add `testimonials` signal to hold fetched testimonial data
- [ ] Call `ContentService.getTestimonials()` in `ngOnInit()`
- [ ] Replace single hardcoded `<lib-testimonial-card>` with `@for` loop over testimonials signal
- [ ] Remove hardcoded testimonial: "Jasmine T., Toronto" quote
- [ ] Display multiple testimonials (backend has 3 seeded)

### 2.3 Community Gallery (home.ts lines 55-62)

- [ ] Call `ContentService.getGallery()` in `ngOnInit()`
- [ ] Add `communityPhotos` signal populated from API response
- [ ] Remove 6 hardcoded Unsplash community photo URLs from `home.ts`
- [ ] Map `GalleryImage` model fields to template bindings

### 2.4 Hero Section Content (home.html lines 4-10)

- [ ] Fetch hero content from `ContentService.getPages()` or a dedicated hero content API
- [ ] Replace hardcoded badge text: "NOW ACCEPTING PRE-ORDERS"
- [ ] Replace hardcoded headline: "Your Hair, Your Origin Story"
- [ ] Replace hardcoded subline: "Premium virgin hair crafted for the woman who demands excellence..."

### 2.5 Brand Story Section (home.html lines 27-35)

- [ ] Call `ContentService.getPage('our-story')` to fetch brand narrative
- [ ] Replace hardcoded brand story paragraphs with API-driven content
- [ ] Replace hardcoded section header label ("OUR STORY") and heading ("Where Luxury Meets Community")
- [ ] Replace hardcoded tagline: "This isn't just hair. It's your origin story."

### 2.6 Trust Bar Items (home.ts lines 36-53)

- [ ] Move trust bar item text to backend content API or configuration
- [ ] Remove 4 inline SVG icon strings from `home.ts` trust items array
- [ ] Externalize SVG icons to a shared icon library or Angular Material icon registry

### 2.7 Benefit Cards (home.html lines 73-84)

- [ ] Move benefit card content (titles + descriptions) to backend content API or configuration
- [ ] Remove 3 inline SVG icon strings from `home.ts` (sparklesIcon, heartIcon, usersIcon)
- [ ] Replace hardcoded benefit: "Ethically Sourced" title and description
- [ ] Replace hardcoded benefit: "Built For Longevity" title and description
- [ ] Replace hardcoded benefit: "Community First" title and description

### 2.8 Final CTA Section (home.html lines 113-120)

- [ ] Move CTA heading, subtext, and trust line to backend content API or configuration
- [ ] Replace hardcoded heading: "Ready to Write Your Origin Story?"
- [ ] Replace hardcoded subtext: "Join hundreds of women across the GTA..."
- [ ] Replace hardcoded trust line: "Free shipping on orders over $150..."

### 2.9 Product Images

- [ ] Upload real product photography for all 12 seeded catalog products
- [ ] Update `ImageUrl` values in `CatalogDbSeeder.cs` from placeholder paths to real URLs
- [ ] Upload real community gallery photos via admin dashboard
- [ ] Verify all image URLs resolve correctly in production

### 2.10 Data Consistency Fix

- [ ] Fix social media URL inconsistency: Storybook stories use `originhair` vs main site uses `originhairco`
- [ ] Ensure all social links consistently use `originhairco` (or whichever is the real handle)

---

## Phase 3: Core E-Commerce Flow

### 3.1 ButtonComponent Click Support

- [ ] Add `@Output() clicked = new EventEmitter<void>()` (or `output()`) to `ButtonComponent`
- [ ] Add `(click)="clicked.emit()"` binding to button element in `ButtonComponent` template
- [ ] Bind `(clicked)` event handler on Header "SHOP NOW" button (`main-layout.html` line 8)
- [ ] Bind `(clicked)` event handler on Mobile nav "SHOP NOW" button (`main-layout.html` line 37)
- [ ] Bind `(clicked)` event handler on Hero "SHOP THE COLLECTION" button (`home.html` line 11)
- [ ] Bind `(clicked)` event handler on Final CTA "SHOP THE COLLECTION" button (`home.html` line 118)
- [ ] Update Storybook stories for ButtonComponent to demonstrate click events

### 3.2 ProductCardComponent Click Support

- [ ] Add `@Output() cardClicked = new EventEmitter<void>()` (or `output()`) to `ProductCardComponent`
- [ ] Add `(click)="cardClicked.emit()"` and `cursor: pointer` to product card template
- [ ] Bind `(cardClicked)` on each product card in `home.html` to navigate to product detail
- [ ] Update Storybook stories for ProductCardComponent to demonstrate click events

### 3.3 Product Listing Page

- [ ] Create `pages/shop/shop.ts` component
- [ ] Create `pages/shop/shop.html` template with product grid
- [ ] Create `pages/shop/shop.scss` styles
- [ ] Inject `CatalogService` and fetch products on init
- [ ] Implement category filtering (Bundles, Closures, Frontals, Wigs)
- [ ] Implement texture filtering (Straight, Wavy, Curly, Kinky)
- [ ] Implement origin filtering (Cambodia, Indonesia, India, Vietnam, Myanmar)
- [ ] Implement price sorting
- [ ] Add route: `{ path: 'shop', loadComponent: () => import('./pages/shop/shop') }`
- [ ] Support query parameter filtering: `/shop?category=bundles`

### 3.4 Product Detail Page

- [ ] Create `pages/product-detail/product-detail.ts` component
- [ ] Create `pages/product-detail/product-detail.html` template
- [ ] Create `pages/product-detail/product-detail.scss` styles
- [ ] Inject `CatalogService` and fetch single product by ID
- [ ] Display product images, description, origin info, pricing
- [ ] Add quantity selector
- [ ] Add "Add to Cart" button
- [ ] Add route: `{ path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail') }`

### 3.5 Shopping Cart

- [ ] Create `pages/cart/cart.ts` component
- [ ] Create `pages/cart/cart.html` template
- [ ] Create `pages/cart/cart.scss` styles
- [ ] Generate or retrieve a sessionId for cart management
- [ ] Inject `OrderService` and call `getCart(sessionId)` on init
- [ ] Implement `addToCart(sessionId, request)` from product detail page
- [ ] Implement `removeCartItem(itemId)` for removing items
- [ ] Implement `clearCart(sessionId)` for emptying cart
- [ ] Display line items with quantities, unit prices, line totals
- [ ] Display cart total
- [ ] Add "Proceed to Checkout" button
- [ ] Add route: `{ path: 'cart', loadComponent: () => import('./pages/cart/cart') }`

### 3.6 Checkout Flow

- [ ] Create `pages/checkout/checkout.ts` component
- [ ] Create `pages/checkout/checkout.html` template with shipping/payment form
- [ ] Create `pages/checkout/checkout.scss` styles
- [ ] Collect customer name, email, shipping address
- [ ] Call `OrderService.createOrder(sessionId, request)` to create order
- [ ] Call `PaymentService.createPayment(request)` to initiate payment
- [ ] Integrate payment gateway UI (Stripe Elements or similar)
- [ ] Call `PaymentService.confirmPayment(id, request)` after gateway confirmation
- [ ] Display order confirmation on success
- [ ] Handle payment failures with appropriate error messages
- [ ] Add route: `{ path: 'checkout', loadComponent: () => import('./pages/checkout/checkout') }`

### 3.7 Payment Gateway Integration (Backend)

- [ ] Choose and install payment gateway SDK (Stripe recommended)
- [ ] Add Stripe API keys to backend configuration (appsettings / environment variables)
- [ ] Implement actual charge logic in `PaymentService.CreatePaymentAsync()`
- [ ] Implement Stripe webhook endpoint for payment confirmations
- [ ] Map Stripe transaction IDs to `externalTransactionId` field
- [ ] Implement PCI-DSS compliant card handling (use Stripe Elements, never handle raw card numbers)
- [ ] Test payment flow end-to-end in Stripe test mode
- [ ] Add 3D Secure / SCA support if serving EU customers

---

## Phase 4: Supporting Pages

### 4.1 Contact Page

- [ ] Create `pages/contact/contact.ts` component
- [ ] Create `pages/contact/contact.html` template with contact form
- [ ] Create `pages/contact/contact.scss` styles
- [ ] Inject `InquiryService` and implement form submission via `createInquiry(request)`
- [ ] Include fields: name, email, phone (optional), message, product interest (optional)
- [ ] Add form validation (required fields, email format)
- [ ] Show success/error states after submission
- [ ] Add route: `{ path: 'contact', loadComponent: () => import('./pages/contact/contact') }`

### 4.2 FAQ Page

- [ ] Create `pages/faq/faq.ts` component
- [ ] Create `pages/faq/faq.html` template with expandable FAQ items
- [ ] Create `pages/faq/faq.scss` styles
- [ ] Inject `ContentService` and call `getFaqs()` on init
- [ ] Group FAQs by category (General, Products, Orders)
- [ ] Implement accordion/expand-collapse for answers
- [ ] Add route: `{ path: 'faq', loadComponent: () => import('./pages/faq/faq') }`

### 4.3 Shipping Info Page

- [ ] Create `pages/shipping-info/shipping-info.ts` component
- [ ] Inject `ContentService` and call `getPage('shipping-info')`
- [ ] Render content page body
- [ ] Add route: `{ path: 'shipping-info', loadComponent: () => import('./pages/shipping-info/shipping-info') }`

### 4.4 Returns & Exchanges Page

- [ ] Create `pages/returns/returns.ts` component
- [ ] Inject `ContentService` and call `getPage('returns-policy')`
- [ ] Render content page body
- [ ] Add route: `{ path: 'returns', loadComponent: () => import('./pages/returns/returns') }`

### 4.5 Hair Care Guide Page

- [ ] Create `pages/hair-care-guide/hair-care-guide.ts` component
- [ ] Inject `ContentService` and call `getPage('hair-care-guide')`
- [ ] Render content page body
- [ ] Add route: `{ path: 'hair-care-guide', loadComponent: () => import('./pages/hair-care-guide/hair-care-guide') }`

### 4.6 Our Story / About Page

- [ ] Create `pages/about/about.ts` component
- [ ] Inject `ContentService` and call `getPage('our-story')`
- [ ] Render content page body
- [ ] Add route: `{ path: 'about', loadComponent: () => import('./pages/about/about') }`

### 4.7 Wholesale Page

- [ ] Create `pages/wholesale/wholesale.ts` component
- [ ] Create template with wholesale inquiry form and bulk pricing info
- [ ] Integrate with `InquiryService.createInquiry()` for wholesale inquiries
- [ ] Add route: `{ path: 'wholesale', loadComponent: () => import('./pages/wholesale/wholesale') }`
- [ ] Add `id="wholesale"` section to homepage OR redirect nav link `#wholesale` to `/wholesale` route

### 4.8 Ambassador Program Page

- [ ] Create `pages/ambassador/ambassador.ts` component
- [ ] Inject `ContentService` and call `getPage('ambassador-program')`
- [ ] Add application/interest form
- [ ] Add route: `{ path: 'ambassador', loadComponent: () => import('./pages/ambassador/ambassador') }`

### 4.9 404 Not Found Page

- [ ] Create `pages/not-found/not-found.ts` component
- [ ] Create template with "Page not found" message and link back to home
- [ ] Add wildcard route: `{ path: '**', loadComponent: () => import('./pages/not-found/not-found') }`

### 4.10 Fix Dead Navigation Links

- [ ] Update Shop footer link "Bundles" href from `#` to `/shop?category=bundles`
- [ ] Update Shop footer link "Closures" href from `#` to `/shop?category=closures`
- [ ] Update Shop footer link "Frontals" href from `#` to `/shop?category=frontals`
- [ ] Update Shop footer link "Bundle Deals" href from `#` to `/shop?category=deals`
- [ ] Update Company footer link "Contact" href from `#` to `/contact`
- [ ] Update Company footer link "Ambassador Program" href from `#` to `/ambassador`
- [ ] Update Support footer link "Hair Care Guide" href from `#` to `/hair-care-guide`
- [ ] Update Support footer link "Shipping Info" href from `#` to `/shipping-info`
- [ ] Update Support footer link "Returns & Exchanges" href from `#` to `/returns`
- [ ] Update Support footer link "FAQ" href from `#` to `/faq`
- [ ] Fix nav link "Wholesale" to route to `/wholesale` instead of `#wholesale` (or add section to homepage)

### 4.11 Fix Misleading Navigation

- [ ] Rename nav label "Hair Care" to "Why Origin" to match the Benefits section content, OR replace the Benefits section content with actual hair care guide content

---

## Phase 5: Communication Features

### 5.1 Chat Widget Backend Integration

- [ ] Import `ChatService` in `MainLayout` component (or a dedicated chat handler)
- [ ] Bind `(messageSent)="onChatMessage($event)"` on `<lib-chat-widget>` in `main-layout.html`
- [ ] Generate or retrieve a sessionId for chat conversations
- [ ] Call `ChatService.createConversation()` when user sends first message
- [ ] Call `ChatService.sendMessage()` for subsequent messages
- [ ] Receive AI-generated responses from backend and pass to `chatWidget.addAiMessage()`
- [ ] Set typing indicator to `true` while waiting for AI response, `false` when received
- [ ] Handle conversation persistence (store conversationId in sessionStorage)
- [ ] Handle errors gracefully (API down, rate limiting)

### 5.2 Newsletter Signup on Main Site

- [ ] Import `EmailSignupComponent` in `HomePage` or `MainLayout`
- [ ] Import `NewsletterService` in the host component
- [ ] Add `<lib-email-signup>` to homepage template (e.g., before final CTA or in footer)
- [ ] Bind `(emailSubmitted)` event to a handler that calls `NewsletterService.subscribe()`
- [ ] Pass `tags: ['origin-hair-collective']` with the subscription request
- [ ] Add loading, success, and error states for the signup form
- [ ] Show confirmation message on successful subscription

### 5.3 Email Provider Integration (Backend)

- [ ] Choose email provider (SendGrid recommended)
- [ ] Install SendGrid SDK in Notification service project
- [ ] Add SendGrid API key to `appsettings.json` / environment variables
- [ ] Add `FromEmail` and `FromName` configuration
- [ ] Create `IEmailSender` interface and `SendGridEmailSender` implementation
- [ ] Register `IEmailSender` in Notification service DI container

### 5.4 Email Templates (Backend)

- [ ] Create HTML email template for Order Confirmation
- [ ] Create HTML email template for Payment Receipt
- [ ] Create HTML email template for Order Status Update (shipped, delivered, etc.)
- [ ] Create HTML email template for Refund Notification
- [ ] Create HTML email template for Inquiry Confirmation
- [ ] Create HTML email template for Chat Conversation Started (admin notification)
- [ ] Create HTML email template for Newsletter Subscription Confirmation
- [ ] Create HTML email template for Campaign Completed (admin notification)
- [ ] Create plain-text fallbacks for all templates

### 5.5 Connect Email Sending to Consumers (Backend)

- [ ] Update `OrderCreatedNotificationConsumer` to actually send email via `IEmailSender`
- [ ] Update `PaymentCompletedNotificationConsumer` to actually send email
- [ ] Update `OrderStatusChangedNotificationConsumer` to actually send email
- [ ] Update `RefundIssuedNotificationConsumer` to actually send email
- [ ] Update `InquiryReceivedNotificationConsumer` to actually send email
- [ ] Update `ChatConversationStartedNotificationConsumer` to actually send email
- [ ] Update `SubscriptionConfirmationConsumer` to actually send email
- [ ] Update `CampaignCompletedNotificationConsumer` to actually send email
- [ ] Set `IsSent` based on actual delivery result (not hardcoded `true`)
- [ ] Capture `errorMessage` on send failure
- [ ] Implement retry logic for transient failures

---

## Phase 6: Pre-Launch Hardening

### 6.1 Database

- [ ] Replace SQLite with production database (PostgreSQL or SQL Server)
- [ ] Update connection strings in all service `appsettings.Production.json` files
- [ ] Run database creation/migration against production database
- [ ] Verify all seeders run correctly against production database
- [ ] Set up automated database backups

### 6.2 Seed Data Review

- [ ] Replace seed password `Password123!` for quinn@crowncommerce.com with secure credential
- [ ] Replace seed password `Password123!` for amara@crowncommerce.com with secure credential
- [ ] Decide whether to keep or remove customer seed accounts (wanjiku, sophia, james)
- [ ] If keeping customer accounts, replace their passwords with secure credentials
- [ ] Review and finalize all 12 product descriptions in `CatalogDbSeeder.cs`
- [ ] Review and finalize all 12 product prices in `CatalogDbSeeder.cs`
- [ ] Review and finalize all 5 hair origin descriptions in `CatalogDbSeeder.cs`
- [ ] Review and finalize all 5 content page bodies in `ContentDbSeeder.cs`
- [ ] Review and finalize all 6 FAQ answers in `ContentDbSeeder.cs`
- [ ] Replace seed testimonials with real customer testimonials (with consent)
- [ ] Clear 19 sample conversation messages from `SchedulingDbSeeder.cs`
- [ ] Review employee data in `SchedulingDbSeeder.cs` for accuracy

### 6.3 Authentication Hardening

- [ ] Add password complexity validation to `IdentityService.RegisterAsync()` (min length, uppercase, number, special char)
- [ ] Implement email verification flow on registration
- [ ] Implement password reset flow (forgot password -> email link -> reset form)
- [ ] Add rate limiting to `/auth/login` endpoint (prevent brute force)
- [ ] Add rate limiting to `/auth/register` endpoint (prevent spam accounts)
- [ ] Consider implementing refresh token mechanism (current tokens expire after 24 hours with no renewal)
- [ ] Configure CORS restrictions on Identity service for production origins only

### 6.4 Error Tracking & Monitoring

- [ ] Integrate error tracking service (Sentry or Azure Application Insights) in frontend
- [ ] Replace `console.error` in `main.ts` bootstrap with error reporting to tracking service
- [ ] Add global Angular `ErrorHandler` that reports uncaught errors
- [ ] Configure OpenTelemetry exporters in backend services for production
- [ ] Set up alerting on critical errors

### 6.5 Testing

- [ ] Fix failing unit test in `app.spec.ts` (expects "Hello, origin-hair-collective" but app renders `<router-outlet />`)
- [ ] Update E2E tests to work with dynamic data instead of hardcoded assertions
- [ ] Add E2E tests for new pages (shop, product detail, cart, checkout)
- [ ] Add E2E tests for contact form submission
- [ ] Add E2E tests for newsletter signup
- [ ] Add E2E tests for chat widget interaction
- [ ] Run full E2E test suite and verify all pass
- [ ] Run Storybook and verify all component stories render correctly

### 6.6 Deployment & Infrastructure

- [ ] Set up RabbitMQ production instance
- [ ] Configure production CORS origins in API Gateway (replace localhost:4200-4204)
- [ ] Set up SSL/TLS certificates for `api.originhair.com`
- [ ] Configure GitHub Actions workflow for deploying the main site (not just coming-soon)
- [ ] Verify Azure Static Web Apps deployment works for production build
- [ ] Set up health check monitoring for all microservices

---

## Summary

| Phase | Items | Focus |
|-------|-------|-------|
| Phase 1: Connect Backend | 20 | API config, security, endpoint verification |
| Phase 2: Replace Hardcoded Data | 35 | Dynamic content from backend services |
| Phase 3: Core E-Commerce | 33 | Shopping flow, cart, checkout, payments |
| Phase 4: Supporting Pages | 22 | Content pages, navigation fixes |
| Phase 5: Communication | 22 | Chat, newsletter, email delivery |
| Phase 6: Pre-Launch Hardening | 27 | Database, security, testing, deployment |
| **Total** | **~159** | |

---

*Derived from automated codebase audit. All items reference specific files and line numbers documented in `docs/origin-hair-collective-audit.md`.*
