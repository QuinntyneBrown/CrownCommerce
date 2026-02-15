# E2E Testing Design: Features Library & Shared Page Object Models

> Comprehensive design for testing the `features` shared library with Playwright and sharing Page Object Models (POMs) across OHC and Mane Haus e2e tests.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Current State Analysis](#current-state-analysis)
3. [Proposed Architecture](#proposed-architecture)
4. [Shared E2E Package Structure](#shared-e2e-package-structure)
5. [Page Object Model Design](#page-object-model-design)
6. [Shared Mock Data & API Fixtures](#shared-mock-data--api-fixtures)
7. [Feature-Level Test Suites](#feature-level-test-suites)
8. [App-Specific Test Extensions](#app-specific-test-extensions)
9. [Configuration & Scripts](#configuration--scripts)
10. [Migration Plan](#migration-plan)
11. [Test Matrix](#test-matrix)

---

## Problem Statement

The `features` library exports **7 intelligent components** and **10 page components** consumed by both **Origin Hair Collective (OHC)** and **Mane Haus**. Today, each app duplicates:

- **Page Object Models** — `ProductsSection`, `TestimonialsSection`, `BenefitsSection`, etc. are copied between apps with minor drift (OHC has `tag` in `ProductCardInfo`, Mane Haus does not; OHC has `quoteIcon`/`quote`/`stars` locators, Mane Haus only has `testimonialCards`)
- **Mock data** — Both apps define nearly identical product/testimonial/gallery mocks
- **API mock setup** — Both apps intercept the same API routes with the same patterns
- **Test logic** — Tests for shared features (products grid, testimonials, FAQ, newsletter) repeat the same assertions

This duplication causes:
- Features bugs caught in OHC tests but missed in Mane Haus (or vice versa)
- POM drift — locators get out of sync when features library CSS classes change
- Maintenance overhead — every features change requires updating 2 sets of tests

---

## Current State Analysis

### Features Library Inventory

**Intelligent Components (7):**

| Component | Selector | Key Interactions |
|-----------|----------|------------------|
| ProductGridComponent | `feat-product-grid` | Filter by category, click product card |
| CartSummaryComponent | `feat-cart-summary` | Remove item, clear cart, view total |
| NewsletterSignupComponent | `feat-newsletter-signup` | Enter email, submit, success/error states |
| ChatContainerComponent | `feat-chat-container` | Open/close panel, send message, typing indicator |
| InquiryFormComponent | `feat-inquiry-form` | Fill form fields, submit, validation errors |
| TestimonialsComponent | `feat-testimonials` | View quotes, ratings, author names |
| FaqListComponent | `feat-faq-list` | Expand/collapse items, grouped by category |

**Page Components (10):**

| Page | Selector | Route (OHC) | Route (Mane Haus) |
|------|----------|-------------|-------------------|
| HomePage | `feat-home-page` | `/` | `/` (custom) |
| ShopPage | `feat-shop-page` | `/shop` | `/collection` |
| ProductDetailPage | `feat-product-detail-page` | `/product/:id` | `/product/:id` |
| CartPage | `feat-cart-page` | `/cart` | `/cart` |
| CheckoutPage | `feat-checkout-page` | `/checkout` | `/checkout` |
| FaqPage | `feat-faq-page` | `/faq` | `/faq` |
| ContactPage | `feat-contact-page` | `/contact` | `/contact` |
| WholesalePage | `feat-wholesale-page` | `/wholesale` | `/wholesale` |
| AmbassadorPage | `feat-ambassador-page` | `/ambassador` | `/ambassador` |
| ContentPage | `feat-content-page` | `/about`, `/shipping-info`, etc. | `/our-story`, `/hair-care`, etc. |

### Existing POM Duplication

Both apps independently define these nearly identical POMs:

| POM Class | OHC | Mane Haus | Identical? |
|-----------|-----|-----------|------------|
| ProductsSection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~85% (OHC has `tag` field, image helpers) |
| TestimonialsSection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~50% (different locator granularity) |
| BenefitsSection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~90% |
| HeroSection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~80% |
| TrustBarSection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~90% |
| BrandStorySection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~90% |
| CommunitySection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~90% |
| FinalCtaSection | `e2e/page-objects/sections/` | `e2e/page-objects/sections/` | ~95% |
| ChatWidgetComponent | `e2e/page-objects/components/` | *(missing)* | N/A |

---

## Proposed Architecture

```
src/CrownCommerce.Web/
├── e2e-shared/                          ← NEW: Shared test infrastructure
│   ├── page-objects/
│   │   ├── components/                  ← POMs for intelligent components
│   │   │   ├── product-grid.component.ts
│   │   │   ├── cart-summary.component.ts
│   │   │   ├── newsletter-signup.component.ts
│   │   │   ├── chat-container.component.ts
│   │   │   ├── inquiry-form.component.ts
│   │   │   ├── testimonials.component.ts
│   │   │   ├── faq-list.component.ts
│   │   │   └── index.ts
│   │   ├── pages/                       ← POMs for feature pages
│   │   │   ├── shop.page.ts
│   │   │   ├── product-detail.page.ts
│   │   │   ├── cart.page.ts
│   │   │   ├── checkout.page.ts
│   │   │   ├── faq.page.ts
│   │   │   ├── contact.page.ts
│   │   │   ├── wholesale.page.ts
│   │   │   ├── ambassador.page.ts
│   │   │   ├── content.page.ts
│   │   │   ├── not-found.page.ts
│   │   │   └── index.ts
│   │   ├── sections/                    ← POMs for home page sections
│   │   │   ├── hero.section.ts
│   │   │   ├── trust-bar.section.ts
│   │   │   ├── brand-story.section.ts
│   │   │   ├── products.section.ts
│   │   │   ├── benefits.section.ts
│   │   │   ├── testimonials.section.ts
│   │   │   ├── community.section.ts
│   │   │   ├── newsletter.section.ts
│   │   │   ├── final-cta.section.ts
│   │   │   └── index.ts
│   │   └── index.ts                     ← Re-exports everything
│   ├── fixtures/
│   │   ├── mock-data.ts                 ← Shared mock products, testimonials, etc.
│   │   ├── api-mocks.ts                 ← Shared API route interceptors
│   │   └── index.ts
│   ├── helpers/
│   │   ├── assertions.ts               ← Common assertion helpers
│   │   ├── navigation.ts               ← Shared navigation utilities
│   │   └── index.ts
│   ├── tests/                           ← Feature-level tests (portable)
│   │   ├── product-grid.spec.ts
│   │   ├── cart-flow.spec.ts
│   │   ├── newsletter-signup.spec.ts
│   │   ├── chat-widget.spec.ts
│   │   ├── inquiry-form.spec.ts
│   │   ├── testimonials.spec.ts
│   │   ├── faq.spec.ts
│   │   ├── shop-page.spec.ts
│   │   ├── product-detail.spec.ts
│   │   ├── checkout-flow.spec.ts
│   │   └── content-page.spec.ts
│   └── tsconfig.json
│
├── projects/
│   ├── origin-hair-collective/
│   │   └── e2e/
│   │       ├── page-objects/
│   │       │   ├── components/
│   │       │   │   ├── header.component.ts     ← App-specific (OHC header layout)
│   │       │   │   ├── footer.component.ts     ← App-specific
│   │       │   │   └── mobile-nav.component.ts ← App-specific
│   │       │   └── pages/
│   │       │       └── home.page.ts            ← Composes shared + app-specific POMs
│   │       ├── fixtures/
│   │       │   └── api-mocks.ts                ← Extends shared mocks with OHC-specific routes
│   │       └── tests/
│   │           ├── home-page.spec.ts           ← App-specific home page tests
│   │           ├── header.spec.ts              ← OHC-specific header tests
│   │           ├── footer.spec.ts
│   │           ├── mobile-navigation.spec.ts
│   │           ├── responsive.spec.ts
│   │           └── ...
│   │
│   └── mane-haus/
│       └── e2e/
│           ├── page-objects/
│           │   ├── components/
│           │   │   ├── header.component.ts     ← Mane Haus header (different from OHC)
│           │   │   ├── footer.component.ts
│           │   │   └── mobile-nav.component.ts
│           │   └── pages/
│           │       ├── home.page.ts            ← Composes shared + MH-specific POMs
│           │       ├── login.page.ts           ← MH-specific (auth required)
│           │       └── register.page.ts        ← MH-specific
│           ├── fixtures/
│           │   └── api-mocks.ts                ← Extends shared mocks with MH auth routes
│           └── tests/
│               ├── home-page.spec.ts
│               ├── header.spec.ts
│               ├── login.spec.ts
│               ├── register.spec.ts
│               └── ...
```

### Key Principles

1. **Feature POMs live in `e2e-shared/`** — One source of truth for every `features` library component
2. **App POMs extend shared POMs** — App-specific pages (header, footer, login) stay in each app's `e2e/`
3. **Feature tests are portable** — Tests in `e2e-shared/tests/` run against any app that uses the feature
4. **App tests remain app-specific** — Layout, navigation, auth, and branding tests stay per-app
5. **Shared mocks, single update** — When the Catalog API changes, update one `mock-data.ts`

---

## Page Object Model Design

### Shared Component POMs

Each features library component gets a POM in `e2e-shared/page-objects/components/`. These POMs target the CSS classes defined in the features library itself, so they work identically in any host app.

```typescript
// e2e-shared/page-objects/components/product-grid.component.ts
import { type Locator, type Page } from '@playwright/test';

export interface ProductCardInfo {
  tag: string | null;
  title: string | null;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
}

export class ProductGridPOM {
  readonly root: Locator;
  readonly cards: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;
  readonly emptyState: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-product-grid, .products__grid');
    this.cards = this.root.locator('lib-product-card');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
    this.emptyState = this.root.locator('.product-grid__empty');
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
  }

  async getCardInfo(index: number): Promise<ProductCardInfo> {
    const card = this.cards.nth(index);
    return {
      tag: await card.locator('.product-card__tag').textContent(),
      title: await card.locator('.product-card__title').textContent(),
      description: await card.locator('.product-card__description').textContent(),
      price: await card.locator('.product-card__price').textContent(),
      imageUrl: await card.locator('.product-card__image img').getAttribute('src'),
    };
  }

  async clickCard(index: number): Promise<void> {
    await this.cards.nth(index).click();
  }

  async isLoading(): Promise<boolean> {
    return this.loadingSpinner.isVisible();
  }

  async hasError(): Promise<boolean> {
    return this.errorState.isVisible();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }
}
```

```typescript
// e2e-shared/page-objects/components/newsletter-signup.component.ts
import { type Locator, type Page } from '@playwright/test';

export class NewsletterSignupPOM {
  readonly root: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-newsletter-signup');
    this.emailInput = this.root.locator('lib-email-signup input[type="email"]');
    this.submitButton = this.root.locator('lib-email-signup button');
    this.successMessage = this.root.locator('.newsletter__success');
    this.errorMessage = this.root.locator('.newsletter__error');
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async isSuccess(): Promise<boolean> {
    return this.successMessage.isVisible();
  }

  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
```

```typescript
// e2e-shared/page-objects/components/chat-container.component.ts
import { type Locator, type Page } from '@playwright/test';

export class ChatContainerPOM {
  readonly fab: Locator;
  readonly panel: Locator;
  readonly headerTitle: Locator;
  readonly headerSubtitle: Locator;
  readonly closeButton: Locator;
  readonly messageThread: Locator;
  readonly messages: Locator;
  readonly aiBubbles: Locator;
  readonly visitorBubbles: Locator;
  readonly typingIndicator: Locator;
  readonly inputField: Locator;
  readonly sendButton: Locator;

  constructor(private page: Page) {
    this.fab = page.locator('button.chat-fab');
    this.panel = page.locator('div.chat-panel');
    this.headerTitle = this.panel.locator('.chat-header__title');
    this.headerSubtitle = this.panel.locator('.chat-header__subtitle');
    this.closeButton = this.panel.locator('button.chat-header__close');
    this.messageThread = this.panel.locator('.chat-messages');
    this.messages = this.messageThread.locator('lib-chat-message');
    this.aiBubbles = this.messageThread.locator('.message__bubble--ai');
    this.visitorBubbles = this.messageThread.locator('.message__bubble--visitor');
    this.typingIndicator = this.messageThread.locator('lib-chat-typing-indicator');
    this.inputField = this.panel.locator('input.chat-input__field');
    this.sendButton = this.panel.locator('button.chat-input__send');
  }

  async open(): Promise<void> {
    await this.fab.click();
    await this.panel.waitFor({ state: 'visible' });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.panel.waitFor({ state: 'hidden' });
  }

  async isOpen(): Promise<boolean> {
    return this.panel.isVisible();
  }

  async sendMessage(text: string): Promise<void> {
    await this.inputField.fill(text);
    await this.sendButton.click();
  }

  async getMessageTexts(): Promise<string[]> {
    return this.messageThread.locator('.message__text').allTextContents();
  }

  async getLastMessageText(): Promise<string> {
    const texts = await this.getMessageTexts();
    return texts[texts.length - 1];
  }

  async waitForAIResponse(): Promise<void> {
    await this.typingIndicator.waitFor({ state: 'visible' });
    await this.typingIndicator.waitFor({ state: 'hidden', timeout: 10_000 });
  }
}
```

```typescript
// e2e-shared/page-objects/components/inquiry-form.component.ts
import { type Locator, type Page } from '@playwright/test';

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId?: string;
}

export class InquiryFormPOM {
  readonly root: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly messageInput: Locator;
  readonly productSelect: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-inquiry-form');
    this.nameInput = this.root.locator('input[name="name"]');
    this.emailInput = this.root.locator('input[name="email"]');
    this.phoneInput = this.root.locator('input[name="phone"]');
    this.messageInput = this.root.locator('textarea[name="message"]');
    this.productSelect = this.root.locator('select[name="productId"]');
    this.submitButton = this.root.locator('lib-button button');
    this.successMessage = this.root.locator('.inquiry-form__success');
    this.errorMessage = this.root.locator('.inquiry-form__error');
  }

  async fillAndSubmit(data: InquiryFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.messageInput.fill(data.message);
    if (data.productId) await this.productSelect.selectOption(data.productId);
    await this.submitButton.click();
  }

  async isSuccess(): Promise<boolean> {
    return this.successMessage.isVisible();
  }
}
```

```typescript
// e2e-shared/page-objects/components/faq-list.component.ts
import { type Locator, type Page } from '@playwright/test';

export class FaqListPOM {
  readonly root: Locator;
  readonly categories: Locator;
  readonly items: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-faq-list, .faq');
    this.categories = this.root.locator('.faq__category');
    this.items = this.root.locator('.faq__item');
  }

  async getCategoryCount(): Promise<number> {
    return this.categories.count();
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async toggleItem(index: number): Promise<void> {
    await this.items.nth(index).locator('.faq__question').click();
  }

  async isItemExpanded(index: number): Promise<boolean> {
    return this.items.nth(index).locator('.faq__answer').isVisible();
  }

  async getItemQuestion(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.faq__question').textContent();
  }

  async getItemAnswer(index: number): Promise<string | null> {
    return this.items.nth(index).locator('.faq__answer').textContent();
  }
}
```

### Shared Section POMs (Home Page Sections)

These target sections rendered by `HomePage` from the features library.

```typescript
// e2e-shared/page-objects/sections/products.section.ts
import { type Locator, type Page } from '@playwright/test';
import { ProductGridPOM, type ProductCardInfo } from '../components/product-grid.component';

export class ProductsSectionPOM {
  readonly root: Locator;
  readonly label: Locator;
  readonly heading: Locator;
  readonly browseAllLink: Locator;
  readonly grid: ProductGridPOM;

  constructor(page: Page) {
    this.root = page.locator('section.products');
    this.label = this.root.locator('.section-header__label');
    this.heading = this.root.locator('.section-header__heading');
    this.browseAllLink = this.root.locator('a.products__browse-link');
    this.grid = new ProductGridPOM(page, this.root);
  }

  async getLabelText(): Promise<string | null> {
    return this.label.textContent();
  }

  async getHeadingText(): Promise<string | null> {
    return this.heading.textContent();
  }

  async clickBrowseAll(): Promise<void> {
    await this.browseAllLink.click();
  }

  // Delegate to grid POM
  async getProductCount(): Promise<number> {
    return this.grid.getCardCount();
  }

  async getProductInfo(index: number): Promise<ProductCardInfo> {
    return this.grid.getCardInfo(index);
  }
}
```

```typescript
// e2e-shared/page-objects/sections/testimonials.section.ts
import { type Locator, type Page } from '@playwright/test';

export class TestimonialsSectionPOM {
  readonly root: Locator;
  readonly label: Locator;
  readonly cards: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.root = page.locator('section.testimonials');
    this.label = this.root.locator('.section-label');
    this.cards = this.root.locator('lib-testimonial-card');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
  }

  async getCardCount(): Promise<number> {
    return this.cards.count();
  }

  async getLabelText(): Promise<string | null> {
    return this.label.textContent();
  }

  async getQuoteText(index = 0): Promise<string | null> {
    return this.cards.nth(index).locator('.testimonial-card__quote').textContent();
  }

  async getAuthorText(index = 0): Promise<string | null> {
    return this.cards.nth(index).locator('.testimonial-card__name').textContent();
  }

  async getStarsText(index = 0): Promise<string | null> {
    return this.cards.nth(index).locator('.testimonial-card__stars').textContent();
  }

  async hasQuoteIcon(index = 0): Promise<boolean> {
    return this.cards.nth(index).locator('.testimonial-card__quote-icon').isVisible();
  }
}
```

### Shared Page POMs

```typescript
// e2e-shared/page-objects/pages/shop.page.ts
import { type Locator, type Page } from '@playwright/test';
import { ProductGridPOM } from '../components/product-grid.component';

export class ShopPagePOM {
  readonly root: Locator;
  readonly heading: Locator;
  readonly categoryFilters: Locator;
  readonly textureFilters: Locator;
  readonly originFilters: Locator;
  readonly sortSelect: Locator;
  readonly grid: ProductGridPOM;

  constructor(private page: Page) {
    this.root = page.locator('feat-shop-page');
    this.heading = this.root.locator('.shop__heading');
    this.categoryFilters = this.root.locator('.shop__filter--category lib-button');
    this.textureFilters = this.root.locator('.shop__filter--texture lib-button');
    this.originFilters = this.root.locator('.shop__filter--origin lib-button');
    this.sortSelect = this.root.locator('.shop__sort select');
    this.grid = new ProductGridPOM(page, this.root);
  }

  async goto(path = '/shop'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterByCategory(label: string): Promise<void> {
    await this.categoryFilters.filter({ hasText: label }).click();
  }

  async filterByTexture(label: string): Promise<void> {
    await this.textureFilters.filter({ hasText: label }).click();
  }

  async sortBy(value: string): Promise<void> {
    await this.sortSelect.selectOption(value);
  }
}
```

```typescript
// e2e-shared/page-objects/pages/cart.page.ts
import { type Locator, type Page } from '@playwright/test';

export class CartPagePOM {
  readonly root: Locator;
  readonly items: Locator;
  readonly emptyState: Locator;
  readonly total: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingLink: Locator;
  readonly clearCartButton: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-cart-page');
    this.items = this.root.locator('.cart__item');
    this.emptyState = this.root.locator('.cart__empty');
    this.total = this.root.locator('.cart__total');
    this.checkoutButton = this.root.locator('.cart__checkout lib-button');
    this.continueShoppingLink = this.root.locator('.cart__continue');
    this.clearCartButton = this.root.locator('.cart__clear');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async getTotalText(): Promise<string | null> {
    return this.total.textContent();
  }

  async removeItem(index: number): Promise<void> {
    await this.items.nth(index).locator('.cart__item-remove').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
```

```typescript
// e2e-shared/page-objects/pages/checkout.page.ts
import { type Locator, type Page } from '@playwright/test';

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
}

export class CheckoutPagePOM {
  readonly root: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly submitButton: Locator;
  readonly successState: Locator;
  readonly orderId: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-checkout-page');
    this.nameInput = this.root.locator('input[name="customerName"]');
    this.emailInput = this.root.locator('input[name="customerEmail"]');
    this.addressInput = this.root.locator('input[name="shippingAddress"], textarea[name="shippingAddress"]');
    this.submitButton = this.root.locator('.checkout__submit lib-button');
    this.successState = this.root.locator('.checkout__success');
    this.orderId = this.root.locator('.checkout__order-id');
    this.errorMessage = this.root.locator('.checkout__error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAndSubmit(data: CheckoutFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.submitButton.click();
  }

  async isSuccess(): Promise<boolean> {
    return this.successState.isVisible();
  }

  async getOrderId(): Promise<string | null> {
    return this.orderId.textContent();
  }
}
```

---

## Shared Mock Data & API Fixtures

```typescript
// e2e-shared/fixtures/mock-data.ts

// ── Products ──
export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Virgin Hair Bundles',
    originId: 'org-001',
    originCountry: 'Brazil',
    texture: 'Body Wave',
    type: 'bestseller',
    lengthInches: 18,
    description: 'Brazilian, Peruvian & Malaysian textures available in 10–30 inch lengths.',
    price: 85,
    imageUrl: '/assets/products/bundles.jpg',
  },
  {
    id: 'prod-002',
    name: 'Lace Closures',
    originId: 'org-002',
    originCountry: 'Peru',
    texture: 'Straight',
    type: 'essential',
    lengthInches: 16,
    description: 'HD lace closures for a seamless, natural look. 4x4 and 5x5 options.',
    price: 65,
    imageUrl: '/assets/products/closures.jpg',
  },
  {
    id: 'prod-003',
    name: 'Lace Frontals',
    originId: 'org-001',
    originCountry: 'Brazil',
    texture: 'Straight',
    type: 'premium',
    lengthInches: 20,
    description: '13x4 and 13x6 HD lace frontals for a flawless ear-to-ear hairline.',
    price: 95,
    imageUrl: '/assets/products/frontals.jpg',
  },
];

// ── Testimonials ──
export const mockTestimonials = [
  {
    id: 'test-001',
    content: "Origin is different — the quality is unmatched, the texture is beautiful, and it literally lasts forever.",
    customerName: 'Jasmine T.',
    customerLocation: 'Toronto',
    rating: 5,
  },
];

// ── Gallery ──
export const mockGalleryImages = [
  { id: 'gal-001', imageUrl: '/assets/gallery/community-1.jpg', caption: 'Look 1', category: 'community' },
  { id: 'gal-002', imageUrl: '/assets/gallery/community-2.jpg', caption: 'Look 2', category: 'community' },
  { id: 'gal-003', imageUrl: '/assets/gallery/community-3.jpg', caption: 'Look 3', category: 'community' },
];

// ── FAQs ──
export const mockFaqs = [
  { id: 'faq-001', question: 'How long does the hair last?', answer: '12+ months with proper care.', category: 'Product' },
  { id: 'faq-002', question: 'Do you offer returns?', answer: 'Yes, within 30 days of purchase.', category: 'Shipping' },
  { id: 'faq-003', question: 'Is the hair ethically sourced?', answer: 'Absolutely. 100% ethical sourcing.', category: 'Product' },
];

// ── Newsletter ──
export const mockNewsletterResponse = { id: 'sub-001', email: 'test@example.com', confirmed: false };

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
```

```typescript
// e2e-shared/fixtures/api-mocks.ts
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

    // Catalog
    if (url.includes('/api/catalog/products') && !url.match(/\/[^/]+$/) && method === 'GET')
      return json(route, data.mockProducts);
    if (url.match(/\/api\/catalog\/products\/[^/]+$/) && method === 'GET')
      return json(route, data.mockProducts[0]);

    // Content
    if (url.includes('/api/content/testimonials')) return json(route, data.mockTestimonials);
    if (url.includes('/api/content/gallery')) return json(route, data.mockGalleryImages);
    if (url.includes('/api/content/faqs')) return json(route, data.mockFaqs);
    if (url.match(/\/api\/content\/pages\/([^/]+)$/)) {
      const slug = url.match(/\/api\/content\/pages\/([^/]+)$/)?.[1] ?? 'about';
      return json(route, data.mockContentPage(slug));
    }

    // Newsletter
    if (url.includes('/api/newsletter/subscribe') && method === 'POST')
      return json(route, data.mockNewsletterResponse, 201);

    // Chat
    if (url.includes('/api/chat')) return json(route, data.mockChatResponse);

    // Orders
    if (url.includes('/api/order') && method === 'POST') return json(route, data.mockOrderResponse, 201);
    if (url.includes('/api/order') && method === 'GET') return json(route, data.mockCartItems);

    // Payment
    if (url.includes('/api/payment') && method === 'POST') return json(route, data.mockPaymentResponse);

    // Inquiry
    if (url.includes('/api/inquiry') && method === 'POST') return json(route, data.mockInquiryResponse, 201);

    // Catch-all
    return json(route, {});
  });
}
```

### App-Specific Mock Extension

```typescript
// projects/origin-hair-collective/e2e/fixtures/api-mocks.ts
import { Page } from '@playwright/test';
import { setupFeatureApiMocks } from '../../../../e2e-shared/fixtures';

export async function setupApiMocks(page: Page): Promise<void> {
  await setupFeatureApiMocks(page);
  // OHC-specific overrides or additional routes here
}
```

```typescript
// projects/mane-haus/e2e/fixtures/api-mocks.ts
import { Page } from '@playwright/test';
import { setupFeatureApiMocks } from '../../../../e2e-shared/fixtures';

export async function setupApiMocks(page: Page): Promise<void> {
  await setupFeatureApiMocks(page);

  // Mane Haus auth routes
  await page.route('**/api/identity/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-jwt-token', user: { name: 'Test User' } }),
    }),
  );
}
```

---

## Feature-Level Test Suites

Feature tests live in `e2e-shared/tests/` and are parameterized by base URL so they can run against either app.

```typescript
// e2e-shared/tests/product-grid.spec.ts
import { test, expect } from '@playwright/test';
import { ProductGridPOM } from '../page-objects/components/product-grid.component';
import { setupFeatureApiMocks } from '../fixtures';
import { mockProducts } from '../fixtures/mock-data';

test.describe('ProductGrid (feat-product-grid)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('displays products from API', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    await expect(grid.cards.first()).toBeVisible();
    expect(await grid.getCardCount()).toBe(mockProducts.length);
  });

  test('shows product name and price on each card', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    const info = await grid.getCardInfo(0);
    expect(info.title).toContain(mockProducts[0].name);
    expect(info.price).toContain('85');
  });

  test('clicking a card navigates to product detail', async ({ page }) => {
    await page.goto('/shop');
    const grid = new ProductGridPOM(page);
    await grid.clickCard(0);
    await expect(page).toHaveURL(/\/product\/prod-001/);
  });
});
```

```typescript
// e2e-shared/tests/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';
import { ShopPagePOM } from '../page-objects/pages/shop.page';
import { CartPagePOM } from '../page-objects/pages/cart.page';
import { CheckoutPagePOM } from '../page-objects/pages/checkout.page';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('Full Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('add to cart → view cart → checkout → order confirmation', async ({ page }) => {
    // 1. Browse shop and click product
    const shop = new ShopPagePOM(page);
    await shop.goto();
    await shop.grid.clickCard(0);

    // 2. Add to cart from detail page
    await page.locator('.product-detail__add-to-cart').click();
    await expect(page.locator('.product-detail__added')).toBeVisible();

    // 3. Go to cart
    const cart = new CartPagePOM(page);
    await cart.goto();
    expect(await cart.getItemCount()).toBeGreaterThan(0);

    // 4. Proceed to checkout
    await cart.proceedToCheckout();

    // 5. Fill checkout form
    const checkout = new CheckoutPagePOM(page);
    await checkout.fillAndSubmit({
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Main St, Toronto, ON',
    });

    // 6. Verify success
    await expect(checkout.successState).toBeVisible({ timeout: 5000 });
  });
});
```

```typescript
// e2e-shared/tests/newsletter-signup.spec.ts
import { test, expect } from '@playwright/test';
import { NewsletterSignupPOM } from '../page-objects/components/newsletter-signup.component';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('NewsletterSignup (feat-newsletter-signup)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('subscribes with valid email and shows success', async ({ page }) => {
    await page.goto('/');
    const newsletter = new NewsletterSignupPOM(page);
    await newsletter.subscribe('test@example.com');
    await expect(newsletter.successMessage).toBeVisible();
  });

  test('shows error for empty email submission', async ({ page }) => {
    await page.goto('/');
    const newsletter = new NewsletterSignupPOM(page);
    await newsletter.submitButton.click();
    // Expect HTML validation or custom error
    await expect(newsletter.emailInput).toBeFocused();
  });
});
```

```typescript
// e2e-shared/tests/chat-widget.spec.ts
import { test, expect } from '@playwright/test';
import { ChatContainerPOM } from '../page-objects/components/chat-container.component';
import { setupFeatureApiMocks } from '../fixtures';

test.describe('ChatContainer (feat-chat-container)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
    await page.goto('/');
  });

  test('opens chat panel when FAB is clicked', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    expect(await chat.isOpen()).toBe(true);
    await expect(chat.headerTitle).toBeVisible();
  });

  test('closes chat panel', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await chat.close();
    expect(await chat.isOpen()).toBe(false);
  });

  test('sends a message and receives AI response', async ({ page }) => {
    const chat = new ChatContainerPOM(page);
    await chat.open();
    await chat.sendMessage('What products do you have?');
    await expect(chat.visitorBubbles.last()).toContainText('What products do you have?');
  });
});
```

```typescript
// e2e-shared/tests/faq.spec.ts
import { test, expect } from '@playwright/test';
import { FaqListPOM } from '../page-objects/components/faq-list.component';
import { setupFeatureApiMocks } from '../fixtures';
import { mockFaqs } from '../fixtures/mock-data';

test.describe('FaqList (feat-faq-list)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
    await page.goto('/faq');
  });

  test('displays FAQ items grouped by category', async ({ page }) => {
    const faq = new FaqListPOM(page);
    expect(await faq.getItemCount()).toBe(mockFaqs.length);
  });

  test('expands an FAQ item on click', async ({ page }) => {
    const faq = new FaqListPOM(page);
    expect(await faq.isItemExpanded(0)).toBe(false);
    await faq.toggleItem(0);
    expect(await faq.isItemExpanded(0)).toBe(true);
    expect(await faq.getItemAnswer(0)).toContain('12+ months');
  });

  test('collapses an expanded FAQ item', async ({ page }) => {
    const faq = new FaqListPOM(page);
    await faq.toggleItem(0);
    expect(await faq.isItemExpanded(0)).toBe(true);
    await faq.toggleItem(0);
    expect(await faq.isItemExpanded(0)).toBe(false);
  });
});
```

---

## App-Specific Test Extensions

### OHC Home Page Test (Composes Shared POMs)

```typescript
// projects/origin-hair-collective/e2e/page-objects/pages/home.page.ts
import { type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';       // App-specific
import { FooterComponent } from '../components/footer.component';       // App-specific
import { MobileNavComponent } from '../components/mobile-nav.component'; // App-specific
import {                                                                 // SHARED
  HeroSectionPOM,
  TrustBarSectionPOM,
  BrandStorySectionPOM,
  ProductsSectionPOM,
  BenefitsSectionPOM,
  TestimonialsSectionPOM,
  CommunitySectionPOM,
  FinalCtaSectionPOM,
  ChatContainerPOM,
} from '../../../../e2e-shared/page-objects';

export class HomePage {
  // App-specific
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly mobileNav: MobileNavComponent;

  // Shared features
  readonly hero: HeroSectionPOM;
  readonly trustBar: TrustBarSectionPOM;
  readonly brandStory: BrandStorySectionPOM;
  readonly products: ProductsSectionPOM;
  readonly benefits: BenefitsSectionPOM;
  readonly testimonials: TestimonialsSectionPOM;
  readonly community: CommunitySectionPOM;
  readonly finalCta: FinalCtaSectionPOM;
  readonly chatWidget: ChatContainerPOM;

  constructor(private page: Page) {
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.mobileNav = new MobileNavComponent(page);
    this.hero = new HeroSectionPOM(page);
    this.trustBar = new TrustBarSectionPOM(page);
    this.brandStory = new BrandStorySectionPOM(page);
    this.products = new ProductsSectionPOM(page);
    this.benefits = new BenefitsSectionPOM(page);
    this.testimonials = new TestimonialsSectionPOM(page);
    this.community = new CommunitySectionPOM(page);
    this.finalCta = new FinalCtaSectionPOM(page);
    this.chatWidget = new ChatContainerPOM(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

### Mane Haus Home Page Test (Composes Shared + MH-Specific)

```typescript
// projects/mane-haus/e2e/page-objects/pages/home.page.ts
import { type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { MobileNavComponent } from '../components/mobile-nav.component';
import {
  HeroSectionPOM,
  TrustBarSectionPOM,
  BrandStorySectionPOM,
  ProductsSectionPOM,
  BenefitsSectionPOM,
  TestimonialsSectionPOM,
  CommunitySectionPOM,
  NewsletterSectionPOM,
  FinalCtaSectionPOM,
} from '../../../../e2e-shared/page-objects';

export class HomePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly mobileNav: MobileNavComponent;
  readonly hero: HeroSectionPOM;
  readonly trustBar: TrustBarSectionPOM;
  readonly brandStory: BrandStorySectionPOM;
  readonly products: ProductsSectionPOM;
  readonly benefits: BenefitsSectionPOM;
  readonly testimonials: TestimonialsSectionPOM;
  readonly community: CommunitySectionPOM;
  readonly newsletter: NewsletterSectionPOM;  // MH has newsletter section
  readonly finalCta: FinalCtaSectionPOM;
  // Note: Mane Haus does NOT have ChatWidget on home — OHC-specific

  constructor(private page: Page) {
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.mobileNav = new MobileNavComponent(page);
    this.hero = new HeroSectionPOM(page);
    this.trustBar = new TrustBarSectionPOM(page);
    this.brandStory = new BrandStorySectionPOM(page);
    this.products = new ProductsSectionPOM(page);
    this.benefits = new BenefitsSectionPOM(page);
    this.testimonials = new TestimonialsSectionPOM(page);
    this.community = new CommunitySectionPOM(page);
    this.newsletter = new NewsletterSectionPOM(page);
    this.finalCta = new FinalCtaSectionPOM(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

---

## Configuration & Scripts

### Shared Tests Config (runs against OHC)

```typescript
// playwright.features.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-shared/tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report/features' }]],
  use: {
    baseURL: 'http://localhost:4201',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### package.json Script Additions

```json
{
  "scripts": {
    "e2e:features": "npx playwright test --config=playwright.features.config.ts",
    "e2e:features:ohc": "npx playwright test --config=playwright.features.config.ts --project=chromium",
    "e2e:features:mh": "BASE_URL=http://localhost:4203 npx playwright test --config=playwright.features.config.ts --project=chromium",
    "e2e:features:ui": "npx playwright test --config=playwright.features.config.ts --ui"
  }
}
```

### tsconfig for e2e-shared

```json
// e2e-shared/tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@e2e-shared/*": ["./*"]
    }
  },
  "include": ["./**/*.ts"]
}
```

---

## Migration Plan

### Phase 1: Create Shared Infrastructure (No Breaking Changes)

1. Create `e2e-shared/` directory structure
2. Write shared POMs (components, sections, pages) based on the unified superset of OHC + Mane Haus locators
3. Write shared `mock-data.ts` and `api-mocks.ts`
4. Write barrel `index.ts` exports for each subdirectory
5. Add `playwright.features.config.ts`
6. Add npm scripts

### Phase 2: Write Feature Tests

1. Create `e2e-shared/tests/` with portable feature tests
2. Run against OHC first (`npm run e2e:features:ohc`) and fix any locator issues
3. Run against Mane Haus (`npm run e2e:features:mh`) and fix routing differences
4. Verify all tests pass on both apps

### Phase 3: Migrate App Tests to Use Shared POMs

1. Update OHC `home.page.ts` to import from `e2e-shared/` instead of local copies
2. Update Mane Haus `home.page.ts` similarly
3. Delete duplicated section POMs from each app's `e2e/page-objects/sections/`
4. Keep app-specific POMs (header, footer, mobile-nav, login, register) in each app
5. Update app `api-mocks.ts` to extend `setupFeatureApiMocks`
6. Delete duplicated mock data from each app

### Phase 4: CI Integration

1. Add feature tests to CI pipeline alongside existing app tests
2. Feature tests run once (not per-app) since they test the library, not the host
3. App-specific tests continue running per-app as before

---

## Test Matrix

### Shared Feature Tests (`e2e-shared/tests/`)

| Test Suite | Components Tested | Priority |
|-----------|-------------------|----------|
| `product-grid.spec.ts` | ProductGridComponent, ProductCard | P0 |
| `shop-page.spec.ts` | ShopPage (filters, sort, grid) | P0 |
| `product-detail.spec.ts` | ProductDetailPage (quantity, add to cart) | P0 |
| `cart-flow.spec.ts` | CartPage (items, remove, total) | P0 |
| `checkout-flow.spec.ts` | Full purchase: shop → cart → checkout | P0 |
| `newsletter-signup.spec.ts` | NewsletterSignupComponent | P1 |
| `chat-widget.spec.ts` | ChatContainerComponent | P1 |
| `testimonials.spec.ts` | TestimonialsComponent | P1 |
| `faq.spec.ts` | FaqListComponent, FaqPage | P1 |
| `inquiry-form.spec.ts` | InquiryFormComponent, ContactPage, WholesalePage | P1 |
| `content-page.spec.ts` | ContentPage (dynamic slugs) | P2 |
| `not-found.spec.ts` | NotFoundPage (404 handling) | P2 |

### App-Specific Tests (remain in each app)

| App | Tests | What They Cover |
|-----|-------|-----------------|
| **OHC** | header, footer, mobile-nav, responsive, home-page composition | OHC layout, nav links, branding, ChatWidget on home |
| **Mane Haus** | header, footer, mobile-nav, login, register, home-page composition | MH auth flow, newsletter on home, MH-specific nav |
| **Admin** | All 17 existing tests | Admin-only CRUD pages, data tables, forms |
| **Teams** | All 6 existing tests | Teams-only chat, meetings, members |

### Coverage by Feature

| Feature | Unit Tests | Shared E2E | OHC E2E | MH E2E |
|---------|-----------|------------|---------|--------|
| ProductGrid | vitest | product-grid.spec | products.spec (home section) | products.spec (home section) |
| ShopPage | vitest | shop-page.spec | — | — |
| CartPage | vitest | cart-flow.spec | — | — |
| CheckoutPage | vitest | checkout-flow.spec | — | — |
| Newsletter | vitest | newsletter-signup.spec | — | newsletter.spec (home section) |
| Chat | vitest | chat-widget.spec | chat-widget.spec | — |
| Testimonials | vitest | testimonials.spec | testimonials.spec (home) | testimonials.spec (home) |
| FAQ | vitest | faq.spec | — | — |
| InquiryForm | vitest | inquiry-form.spec | — | — |
| Header | — | — | header.spec | header.spec |
| Footer | — | — | footer.spec | footer.spec |
| Auth | — | — | — | login.spec, register.spec |

---

## Summary

| Metric | Before | After |
|--------|--------|-------|
| **Duplicated POMs** | 8 section POMs x 2 apps = 16 files | 8 shared + 0 duplicates |
| **Duplicated mock data** | 2 identical files | 1 shared file |
| **Duplicated API mocks** | 2 near-identical files | 1 shared + 2 thin extensions |
| **Feature test coverage** | Implicit (via app home page tests only) | 12 dedicated feature test suites |
| **Locator drift risk** | High (manual sync) | Zero (single source of truth) |
| **Time to add new feature test** | Write twice | Write once, runs everywhere |
