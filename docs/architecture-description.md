# CrownCommerce Software Architecture Description

**Standard:** ISO/IEC/IEEE 42010:2022 — Architecture description of software-intensive systems

**Version:** 1.0
**Date:** 2026-04-07
**Status:** Approved

---

## 1. Architecture Description Identification

| Field | Value |
|-------|-------|
| **System Name** | CrownCommerce |
| **Purpose** | Multi-brand premium hair product e-commerce platform with administrative tooling and internal team collaboration |
| **Scope** | Full-stack web application encompassing consumer storefronts, admin panel, team collaboration app, backend API, CLI tooling, and end-to-end test harness |
| **Requirements Baseline** | [L1 High-Level Requirements](specs/L1.md), [L2 Detailed Requirements](specs/L2.md) |
| **Architecture Owner** | CrownCommerce Engineering |

---

## 2. System of Interest

CrownCommerce is a software-intensive system that operates as a multi-brand e-commerce platform for premium hair products (bundles, closures, frontals, wigs). The system serves three distinct user populations through six frontend applications backed by a unified API layer with eleven domain modules.

### 2.1 System Boundary

The system encompasses:

- **Consumer storefronts** — Two branded shopping experiences (Origin Hair Collective, Mane Haus) plus their pre-launch variants
- **Administrative panel** — Back-office management for all platform data
- **Team collaboration platform** — Internal communication, scheduling, and employee management
- **Backend API** — Unified API surface serving all frontend applications
- **CLI tool** — Developer and operator tooling for database, deployment, and platform operations
- **Test harness** — End-to-end test suite covering all six frontend applications

### 2.2 External Interfaces

| Interface | Direction | Purpose |
|-----------|-----------|---------|
| Payment Gateway | Outbound | Payment processing, confirmation, refunds (L1-004) |
| AI Service | Outbound | Automated chat responses for customer-facing chat widget (L1-009) |
| Email Delivery Service | Outbound | Newsletter campaigns, transactional email, meeting invitations (L1-007, L1-033) |
| Object Storage | Outbound | File upload and retrieval for chat attachments (L1-027) |
| DNS Provider | Outbound | Custom domain resolution for branded storefronts |

---

## 3. Stakeholders and Concerns

### 3.1 Stakeholder Registry

| Stakeholder | Role | Key Concerns |
|-------------|------|--------------|
| **Customers** | End users of consumer storefronts | Performance, usability, mobile experience, trust, checkout reliability |
| **Brand Owners** | Business operators of Origin Hair Collective and Mane Haus | Brand identity integrity, content control, sales analytics, subscriber growth |
| **Administrators** | Back-office operators | Data management efficiency, visibility across all platform data, campaign management |
| **Team Members** | Internal employees | Real-time communication, meeting scheduling, presence visibility |
| **Developers / AI Agents** | System builders and maintainers | Development velocity, code navigability, minimal build complexity, fast feedback loops |
| **DevOps / Operations** | Deployment and infrastructure | Deployment simplicity, observability, migration safety, environment parity |

### 3.2 Concern-Stakeholder Matrix

| Concern | ID | Stakeholders | Addressed By |
|---------|----|-------------|--------------|
| Multi-brand theming with shared codebase | C-01 | Brand Owners, Developers | Viewpoints 4.1, 4.2 |
| Development velocity for AI agent workflows | C-02 | Developers | Viewpoints 4.1, 4.3, 4.5 |
| Domain isolation without operational complexity | C-03 | Developers, DevOps | Viewpoints 4.2, 4.3 |
| Real-time communication reliability | C-04 | Team Members | Viewpoint 4.2 |
| Responsive design across all viewports | C-05 | Customers | Viewpoint 4.1 |
| Security and access control | C-06 | All | Viewpoint 4.4 |
| Data integrity and schema evolution | C-07 | DevOps, Developers | Viewpoints 4.3, 4.5 |
| Content and catalog manageability | C-08 | Administrators, Brand Owners | Viewpoints 4.1, 4.2 |
| Test confidence across 6 applications | C-09 | Developers | Viewpoint 4.5 |
| Zero-configuration deployment | C-10 | DevOps, Developers | Viewpoint 4.5 |

---

## 4. Architecture Viewpoints and Views

### 4.1 Functional Viewpoint

**Concern addressed:** C-01, C-02, C-05, C-08
**Stakeholders:** Customers, Brand Owners, Administrators, Team Members, Developers

#### 4.1.1 Frontend Application Structure

The system presents six user-facing applications served from a single deployable unit using hostname-based routing:

```
Hostname Detection (middleware)
├── originhair.com          → Storefront (dark luxury theme)
├── manehaus.com            → Storefront (warm luxury theme)
├── originhair.com/soon     → Coming Soon (dark luxury)
├── manehaus.com/soon       → Coming Soon (warm luxury)
├── admin.crowncommerce.com → Admin Panel
└── teams.crowncommerce.com → Team Collaboration
```

**Technology Selection: Next.js 15 (App Router) + TypeScript**

Rationale (optimized for AI agent development velocity):
- File-based routing eliminates routing configuration — one file per route
- Server Components reduce client-side state complexity
- React ecosystem provides the largest training corpus for AI agents
- Single-language stack (TypeScript end-to-end) eliminates context switching
- App Router route groups map directly to the multi-app requirement without separate build pipelines

#### 4.1.2 Route Groups

```
/app
├── (storefront)/                    # Consumer routes (L1-010)
│   ├── layout.tsx                   # MainLayout: header, footer, chat widget
│   ├── page.tsx                     # Home (configurable per brand)
│   ├── shop/page.tsx                # Product listing (L2-001)
│   ├── product/[id]/page.tsx        # Product detail (L2-002)
│   ├── cart/page.tsx                # Shopping cart (L2-005)
│   ├── checkout/page.tsx            # Checkout flow (L2-006)
│   ├── contact/page.tsx             # Contact form (L2-016)
│   ├── wholesale/page.tsx           # Wholesale inquiry (L2-017)
│   ├── ambassador/page.tsx          # Ambassador application (L2-018)
│   ├── faq/page.tsx                 # FAQ accordion (L2-011)
│   ├── [slug]/page.tsx              # Dynamic content pages (L2-010)
│   ├── bundles/page.tsx             # Collection page (L2-075)
│   ├── closures/page.tsx            # Collection page (L2-075)
│   ├── frontals/page.tsx            # Collection page (L2-075)
│   ├── bundle-deals/page.tsx        # Collection page (L2-075)
│   ├── login/page.tsx               # Customer login (L2-066)
│   ├── register/page.tsx            # Customer registration (L2-066)
│   ├── account/page.tsx             # Customer profile (L2-065)
│   ├── account/orders/page.tsx      # Order history (L2-065)
│   ├── order/[id]/page.tsx          # Order detail (L2-065)
│   ├── newsletter/confirm/page.tsx  # Newsletter confirmation (L2-079)
│   └── newsletter/unsubscribe/page.tsx
│
├── (admin)/                         # Admin routes (L1-012)
│   ├── layout.tsx                   # Sidebar layout (L2-062)
│   ├── dashboard/page.tsx           # Dashboard (L2-024)
│   ├── products/page.tsx            # Product CRUD (L2-003)
│   ├── origins/page.tsx             # Origin CRUD (L2-004)
│   ├── customers/page.tsx           # CRM customers (L2-069)
│   ├── orders/page.tsx              # Order management (L2-067)
│   ├── leads/page.tsx               # Lead management (L2-070)
│   ├── inquiries/page.tsx           # Inquiry management (L2-019)
│   ├── testimonials/page.tsx        # Testimonial CRUD (L2-012)
│   ├── faqs/page.tsx                # FAQ CRUD (L2-074)
│   ├── gallery/page.tsx             # Gallery CRUD (L2-072)
│   ├── content-pages/page.tsx       # Content page CRUD (L2-073)
│   ├── subscribers/page.tsx         # Subscriber management (L2-015)
│   ├── campaigns/page.tsx           # Campaign management (L2-071)
│   ├── employees/page.tsx           # Employee management (L2-034)
│   ├── users/page.tsx               # User management (L2-068)
│   ├── schedule/page.tsx            # Calendar view (L2-031)
│   ├── meetings/page.tsx            # Meeting creation (L2-032)
│   ├── conversations/page.tsx       # Admin messaging (L2-033)
│   ├── hero-content/page.tsx        # Hero management (L2-025)
│   └── trust-bar/page.tsx           # Trust bar management (L2-026)
│
├── (teams)/                         # Team collaboration routes (L1-013)
│   ├── layout.tsx                   # Teams sidebar (L2-063)
│   ├── home/page.tsx                # Dashboard (L2-027)
│   ├── chat/page.tsx                # Chat channels (L2-028)
│   ├── meetings/page.tsx            # Meeting management (L2-029)
│   ├── team/page.tsx                # Team directory (L2-030)
│   └── login/page.tsx               # Teams login (L2-080)
│
├── (coming-soon)/                   # Pre-launch routes (L1-011)
│   ├── origin/page.tsx              # Origin coming soon (L2-023)
│   └── mane-haus/page.tsx           # Mane Haus coming soon (L2-023)
│
└── api/                             # API routes (see 4.2)
```

#### 4.1.3 Shared Frontend Modules (L1-019)

Code reuse across the six applications is organized into three module boundaries:

| Module | Responsibility | Dependency Rule |
|--------|---------------|-----------------|
| `components/` | Presentational UI primitives (buttons, cards, spinners, forms). Zero service dependencies. Accept data via props, emit events via callbacks. (L2-040) | None — leaf module |
| `lib/api/` | Typed HTTP client functions for all 11 domain APIs, auth interceptor, error interceptor, configurable base URL. (L2-041) | None — leaf module |
| `lib/features/` | Intelligent components (product grid, cart summary, newsletter signup, chat container, inquiry form, testimonials, FAQ list) and shared page compositions. Compose `components/` + `lib/api/`. (L2-042) | Depends on `components/` and `lib/api/` |

#### 4.1.4 Design System and Theming (L1-018)

Multi-brand theming is achieved through design tokens scoped per hostname:

| Token Category | Origin Hair Collective | Mane Haus |
|----------------|----------------------|-----------|
| Background primary | `#1A1A1C` | Warm palette |
| Accent | `#C9A962` (gold) | Warm accent |
| Typography headings | Fraunces | Fraunces |
| Typography body | DM Sans | DM Sans |
| Aesthetic | Dark luxury | Warm luxury |

Brand context is determined at the middleware layer and injected into the root layout, where design tokens are set. All components reference tokens — no hardcoded color values (L2-039).

#### 4.1.5 Styling Technology: Tailwind CSS

Rationale:
- AI agents generate Tailwind utility classes faster and more accurately than any other styling approach
- Co-located with markup — no separate style files, no naming decisions
- Design tokens map directly to Tailwind theme configuration
- Responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`) align with L1-017 viewport requirements

#### 4.1.6 UI Component Primitives: shadcn/ui

Rationale:
- Copy-paste components (not a dependency) — agents can read and modify every line
- No abstraction wall blocking customization
- Built on Radix UI primitives — accessible by default
- Tailwind-native styling integrates with the design token system

---

### 4.2 Information / Data Viewpoint

**Concern addressed:** C-03, C-07, C-08
**Stakeholders:** Developers, DevOps, Administrators

#### 4.2.1 Domain Model Organization

The system organizes data into 11 domain modules with logical schema isolation within a single PostgreSQL database:

```
PostgreSQL Database: crown_commerce
│
├── catalog.*           Products, Origins, Reviews, BundleDeals
│   ├── products        (id, name, description, price, texture, type, length, origin_id, image_url)
│   ├── origins         (id, name, country)
│   ├── reviews         (id, product_id, author, rating, content, created_at)
│   └── bundle_deals    (id, name, items[], original_price, deal_price)
│
├── orders.*            Carts, Orders, OrderItems, Payments
│   ├── carts           (id, user_id, created_at)
│   ├── cart_items       (id, cart_id, product_id, quantity)
│   ├── orders          (id, user_id, status, total, shipping_address, created_at)
│   ├── order_items      (id, order_id, product_id, quantity, unit_price)
│   └── payments        (id, order_id, amount, status, confirmed_at, refunded_at)
│
├── identity.*          Users, Sessions, Roles
│   ├── users           (id, name, email, password_hash, role, created_at)
│   └── sessions        (id, user_id, token, expires_at)
│
├── content.*           Pages, FAQs, Testimonials, Gallery, HeroContent, TrustBar
│   ├── pages           (id, title, slug, body, created_at)
│   ├── faqs            (id, question, answer, category)
│   ├── testimonials    (id, quote, author, rating, location)
│   ├── gallery_images  (id, url, alt_text, category)
│   ├── hero_content    (id, title, subtitle, cta_text, cta_link, image_url)
│   └── trust_bar_items (id, icon, text, description)
│
├── newsletter.*        Subscribers, Campaigns, Recipients
│   ├── subscribers     (id, email, brand_tag, status, confirmed_at)
│   ├── campaigns       (id, subject, html_body, text_body, tag, status, scheduled_at, sent_at)
│   └── campaign_recipients (id, campaign_id, subscriber_id, delivery_status)
│
├── chat.*              Conversations, Messages
│   ├── conversations   (id, user_id, created_at)
│   └── messages        (id, conversation_id, role, content, created_at)
│
├── inquiries.*         Inquiries
│   └── inquiries       (id, name, email, subject, message, category, status, created_at)
│
├── scheduling.*        Employees, Channels, ChannelMessages, Meetings, Attendees, Files
│   ├── employees       (id, user_id, name, role, department, timezone, presence, avatar_url)
│   ├── channels        (id, name, type, created_by)
│   ├── channel_messages (id, channel_id, sender_id, content, attachments[], created_at)
│   ├── meetings        (id, title, description, date, start_time, end_time, location, organizer_id)
│   ├── meeting_attendees (id, meeting_id, employee_id, rsvp_status)
│   └── files           (id, filename, url, content_type, uploaded_by, created_at)
│
├── crm.*               Customers, Leads
│   ├── customers       (id, name, email, status, tier, order_count)
│   └── leads           (id, name, email, phone, source, status, notes, created_at)
│
└── notifications.*     Notifications
    └── notifications   (id, recipient_id, type, message, read, created_at)
```

**Technology Selection: PostgreSQL + Drizzle ORM**

Rationale:
- **PostgreSQL** — Single database, schema-based isolation. Each domain module owns its schema, satisfying L1-015 isolation requirements without the operational cost of 11 separate databases. Row-level security available if needed.
- **Drizzle ORM** — Schema defined as TypeScript (no codegen step, no client regeneration). AI agents edit the schema file and it works immediately. SQL-like query builder means agents reason about queries directly rather than through abstraction layers.

#### 4.2.2 Data Isolation Strategy

Rather than separate databases per domain (operationally expensive, 11x migration complexity), the architecture uses PostgreSQL schemas:

- Each domain module has its own schema (`catalog`, `orders`, `identity`, etc.)
- Schema migrations are managed per-domain via the `cc migrate` CLI (L2-046)
- Cross-domain reads use explicit schema-qualified queries — no implicit coupling
- Each domain module is independently migratable (L2-054)
- Idempotent seeders populate reference data per schema on first startup (L2-050)

#### 4.2.3 Real-Time Data Flow

For team collaboration features (L1-026), the system uses WebSocket connections:

```
Browser ←→ WebSocket Server ←→ Channel Groups
                                 ├── Public Channels
                                 ├── Direct Message Channels
                                 ├── Presence Updates
                                 └── Typing Indicators
```

Events: `message:new`, `presence:update`, `typing:start`, `typing:stop`

---

### 4.3 Development Viewpoint

**Concern addressed:** C-02, C-03, C-09
**Stakeholders:** Developers / AI Agents

This viewpoint addresses the primary architectural driver: **optimizing for AI agent development velocity and code quality**.

#### 4.3.1 Repository Structure

```
crown-commerce/
├── app/                          # Next.js App Router (all routes)
│   ├── (storefront)/             # Consumer storefront routes
│   ├── (admin)/                  # Admin panel routes
│   ├── (teams)/                  # Team collaboration routes
│   ├── (coming-soon)/            # Pre-launch routes
│   ├── api/                      # API route handlers
│   │   ├── catalog/              # Catalog endpoints
│   │   ├── orders/               # Order endpoints
│   │   ├── payments/             # Payment endpoints
│   │   ├── identity/             # Auth endpoints
│   │   ├── content/              # Content endpoints
│   │   ├── newsletter/           # Newsletter endpoints
│   │   ├── chat/                 # Chat endpoints
│   │   ├── inquiries/            # Inquiry endpoints
│   │   ├── scheduling/           # Scheduling endpoints
│   │   ├── notifications/        # Notification endpoints
│   │   └── crm/                  # CRM endpoints
│   ├── layout.tsx                # Root layout (theme provider)
│   └── middleware.ts             # Hostname → brand context
│
├── components/                   # Presentational UI primitives (L2-040)
│   ├── ui/                       # shadcn/ui base components
│   ├── product-card.tsx
│   ├── testimonial-card.tsx
│   ├── email-signup.tsx
│   ├── chat-widget.tsx
│   ├── section-header.tsx
│   ├── loading-spinner.tsx
│   └── error-state.tsx
│
├── lib/
│   ├── api/                      # Typed API client functions (L2-041)
│   │   ├── catalog.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   ├── identity.ts
│   │   ├── content.ts
│   │   ├── newsletter.ts
│   │   ├── chat.ts
│   │   ├── inquiries.ts
│   │   ├── scheduling.ts
│   │   ├── notifications.ts
│   │   └── crm.ts
│   ├── features/                 # Intelligent compositions (L2-042)
│   │   ├── product-grid.tsx
│   │   ├── cart-summary.tsx
│   │   ├── newsletter-signup.tsx
│   │   ├── chat-container.tsx
│   │   ├── inquiry-form.tsx
│   │   ├── testimonials-section.tsx
│   │   └── faq-list.tsx
│   ├── db/                       # Database schema and queries
│   │   ├── schema/               # Drizzle schema per domain
│   │   │   ├── catalog.ts
│   │   │   ├── orders.ts
│   │   │   ├── identity.ts
│   │   │   ├── content.ts
│   │   │   ├── newsletter.ts
│   │   │   ├── chat.ts
│   │   │   ├── inquiries.ts
│   │   │   ├── scheduling.ts
│   │   │   ├── crm.ts
│   │   │   └── notifications.ts
│   │   ├── seed/                 # Idempotent seeders (L2-050)
│   │   └── index.ts              # DB client
│   ├── auth/                     # Auth utilities (L2-009, L2-055)
│   │   ├── session.ts
│   │   ├── guards.ts
│   │   └── middleware.ts
│   ├── realtime/                 # WebSocket server (L2-051)
│   └── theme/                    # Design token definitions (L2-039)
│
├── cc/                           # CLI tool source (L1-022)
│
├── e2e/                          # End-to-end tests (L1-023)
│   ├── storefront/
│   ├── admin/
│   ├── teams/
│   └── fixtures/
│
├── drizzle.config.ts             # Drizzle ORM config
├── tailwind.config.ts            # Tailwind + design tokens
├── next.config.ts                # Next.js configuration
├── playwright.config.ts          # E2E test configuration
└── package.json
```

#### 4.3.2 Agent Efficiency Design Principles

The architecture is designed around the following principles that maximize AI agent productivity:

| Principle | Implementation | Impact |
|-----------|---------------|--------|
| **One file = one concern** | Each route is a single file. Each API endpoint is a single file. Each schema is a single file. | Agent needs minimal context to make a change |
| **Zero build pipeline** | `next dev` starts everything. No library pre-build steps, no multi-project orchestration. | Agent never stalls on build configuration |
| **Single codebase** | All 6 apps, all API endpoints, all schemas live in one repository with one `node_modules`. | Agent can grep the entire system, hold the full picture in context |
| **TypeScript everywhere** | Frontend, backend, schema, CLI — all TypeScript. | No language switching, consistent tooling |
| **Convention over configuration** | File-system routing, co-located API handlers, schema-as-code. | Agent follows patterns rather than reading config |
| **Instant feedback** | Hot reload on save, type errors surface immediately, test runner watches. | Agent validates changes without manual steps |

#### 4.3.3 Adding a New Feature (Agent Workflow)

To illustrate agent efficiency, adding a complete new CRUD domain (e.g., "Wishlists"):

1. Create schema: `lib/db/schema/wishlists.ts` (1 file)
2. Push schema: `npx drizzle-kit push` (1 command)
3. Create API routes: `app/api/wishlists/route.ts`, `app/api/wishlists/[id]/route.ts` (2 files)
4. Create API client: `lib/api/wishlists.ts` (1 file)
5. Create admin page: `app/(admin)/wishlists/page.tsx` (1 file)
6. Create storefront page: `app/(storefront)/wishlists/page.tsx` (1 file)

**Total: 6 files, 1 command, zero configuration changes.**

#### 4.3.4 Technology Selections for Agent Efficiency

| Layer | Technology | Agent-Efficiency Rationale |
|-------|-----------|---------------------------|
| **Framework** | Next.js 15 (App Router) | File-based routing, server components, largest React training corpus |
| **Language** | TypeScript 5.x | Type safety catches errors without execution, single language end-to-end |
| **Styling** | Tailwind CSS | Agents generate correct utility classes on first attempt more often than any alternative |
| **UI Primitives** | shadcn/ui | Copy-paste components with no abstraction wall; agents can read and modify every line |
| **ORM** | Drizzle | Schema-as-TypeScript, no codegen, SQL-like queries agents reason about directly |
| **Database** | PostgreSQL | Universal agent knowledge, schema isolation, single operational target |
| **Auth** | Auth.js (NextAuth v5) | Minimal configuration, built-in session management and role-based middleware |
| **Forms** | React Hook Form + Zod | Agents produce correct validated forms on first attempt at highest rate |
| **Real-Time** | WebSocket (native or Ably/Pusher) | Simple event-based API, no hub lifecycle management |
| **AI Chat** | Vercel AI SDK | Streaming AI responses in 3 lines of code |
| **Email** | Resend + React Email | Email templates as React components — agents already know the paradigm |
| **File Storage** | S3-compatible (presigned URLs) | Simple upload/download API, no file system management |
| **E2E Testing** | Playwright | Best-in-class browser automation, structured page abstractions |
| **Deployment** | Vercel | Zero-config deploys from git push, preview deploys per PR |

---

### 4.4 Security Viewpoint

**Concern addressed:** C-06
**Stakeholders:** All

#### 4.4.1 Authentication Architecture (L1-005, L2-008, L2-055)

```
Client → Auth Middleware → Protected Route
  │
  ├── POST /api/identity/auth/register → Create user, return token
  ├── POST /api/identity/auth/login    → Validate credentials, return token
  └── GET  /api/identity/auth/profile  → Return authenticated user profile
```

- Token-based authentication with claims: user ID (sub), email, name, role
- Token validation on every protected API route via middleware
- Issuer/audience verification on all backend routes
- Signing key externalized — never hardcoded in production (L2-055)
- Expired tokens return 401

#### 4.4.2 Authorization Model

| Role | Access Scope |
|------|-------------|
| **Customer** | Consumer storefronts, own account/orders, cart, checkout, reviews, chat |
| **Admin** | Full admin panel access, all CRUD operations, campaign management |
| **Team Member** | Teams app access, chat channels, meetings, team directory |

Route-level auth guards enforce role-based access (L2-009):
- Unauthenticated users redirected to login
- Role mismatches return 403
- Auth token cleared on logout with redirect

#### 4.4.3 Security Controls (L1-024)

| Control | Implementation |
|---------|---------------|
| Transport security | HTTPS-only for all communications |
| Input validation | All API endpoints validate request bodies; 400 returned for invalid data (L2-056) |
| XSS prevention | User input sanitized before rendering in frontend (L2-056) |
| OWASP Top 10 | Addressed across all layers |
| Credential management | No hardcoded secrets in production; environment-based configuration |
| CSRF protection | Framework-provided CSRF tokens on state-changing operations |

---

### 4.5 Deployment Viewpoint

**Concern addressed:** C-10, C-07
**Stakeholders:** DevOps, Developers

#### 4.5.1 Deployment Architecture

```
Git Push
  │
  ▼
CI Pipeline
  ├── Type check (tsc --noEmit)
  ├── Lint
  ├── Unit tests
  ├── Build
  └── E2E tests (Playwright)
        │
        ▼
  Deploy to hosting platform
  ├── Preview deployment (per PR)
  └── Production deployment (on merge to main)
```

**Technology Selection: Vercel**

Rationale:
- Zero-configuration deployments from git push
- Preview deployments per pull request — agents validate their own work visually
- Built-in edge middleware for hostname-based brand routing
- Serverless API routes scale per-endpoint
- No Dockerfiles, nginx configs, or CI pipeline authoring required

#### 4.5.2 Environment Topology

| Environment | Purpose | Trigger |
|-------------|---------|---------|
| **Local** | Development with hot reload | `next dev` |
| **Preview** | Per-PR preview with full functionality | Git push to feature branch |
| **Staging** | Pre-production validation | Merge to `staging` branch |
| **Production** | Live customer-facing deployment | Merge to `main` branch |

#### 4.5.3 Database Migration Strategy (L2-046)

```
Developer/Agent
  │
  ├── Edit schema file (lib/db/schema/*.ts)
  ├── Generate migration: cc migrate add <domain> <name>
  ├── Review generated SQL
  ├── Apply locally: cc migrate apply <domain>
  └── Push — migration runs in CI/CD pipeline
```

Migrations are per-domain-schema, independently applicable (L2-054).

#### 4.5.4 CLI Tool (`cc`) (L1-022)

The `cc` CLI provides operator tooling:

| Command | Purpose | Traces To |
|---------|---------|-----------|
| `cc migrate add/apply/status/script/rollback/validate` | Database migration management | L2-046 |
| `cc deploy <service> --env <env>` | Deployment orchestration | L2-047 |
| `cc seed` | Database seeding | L1-025 |
| `cc health` | Environment health checks | L1-022 |
| `cc campaign` | Email campaign management | L1-033 |
| `cc logs` | Log viewing | L1-022 |
| `cc scaffold` | Code generation | L1-022 |

#### 4.5.5 Database Seeding (L2-050)

On first startup, idempotent seeders populate each schema:

| Schema | Seed Data |
|--------|-----------|
| catalog | 5 origins, 12 products |
| content | 5 pages, 6 FAQs, 3 testimonials |
| identity | 5 users (2 admin, 3 customer) |
| scheduling | 5 employees, 4 meetings, 7 channels, 12 messages |

Seeders detect existing data and skip — safe to run on every deployment.

---

## 5. Architecture Rationale

### 5.1 Key Decisions

#### AD-01: Monolith with Domain Schemas vs. Microservices

**Decision:** Implement backend as a modular monolith with PostgreSQL schema-per-domain rather than independent microservices.

**Rationale:**
- The requirements specify 11 domain modules (L1-015). As independent microservices, this creates 11 deployment targets, 11 database instances, 11 migration pipelines, and gateway routing configuration.
- AI agents are dramatically faster with a single codebase. An agent can grep one repository, hold the full picture in context, and make cross-domain changes atomically.
- Schema-per-domain satisfies the isolation requirement (L2-054) — each domain owns its tables, migrations are independent, and there is no implicit coupling.
- Operational cost drops from O(n) services to O(1). One deploy, one database, one monitoring target.
- If true service independence becomes necessary (e.g., independent scaling), the domain boundaries are clean enough to extract.

**Trade-off accepted:** Lose independent deployment per domain. Mitigated by the small team size and the fact that all domains deploy together in practice.

#### AD-02: Next.js App Router vs. Separate Frontend Framework

**Decision:** Use Next.js App Router with route groups for all 6 applications.

**Rationale:**
- Six separate frontend applications (the requirements specify 6 apps) would mean 6 build pipelines, 6 CI configurations, and shared library pre-build steps.
- Route groups (`(storefront)`, `(admin)`, `(teams)`, `(coming-soon)`) provide the same logical separation with one build.
- Server Components enable data fetching at the route level without client-side state management complexity.
- The shared module architecture (L1-019: `components`, `api`, `features`) maps directly to directory imports — no library build step required.

#### AD-03: Tailwind CSS + shadcn/ui vs. Custom Component Library

**Decision:** Use Tailwind CSS for styling and shadcn/ui for component primitives.

**Rationale:**
- AI agents generate Tailwind utility classes with higher accuracy and speed than any other styling approach.
- shadcn/ui components are copied into the project (not installed as a dependency), making every line readable and modifiable by agents.
- Design tokens (L1-018) map directly to Tailwind theme configuration — the dark/warm luxury palettes are theme variants.
- Responsive breakpoints in Tailwind (`sm:`, `md:`, `lg:`, `xl:`) align with the L1-017 viewport requirements.

#### AD-04: Drizzle ORM vs. Prisma

**Decision:** Use Drizzle ORM for database access.

**Rationale:**
- Schema defined as TypeScript — no separate schema language, no code generation step.
- Agents edit the schema file and it takes effect immediately (no `prisma generate` step that can fail or get out of sync).
- SQL-like query API means agents can reason about database queries directly rather than learning an abstraction layer.
- Schema-per-domain is natively supported via Drizzle's schema organization.

#### AD-05: PostgreSQL vs. SQLite

**Decision:** Use PostgreSQL as the single database engine.

**Rationale:**
- Schema-based isolation (`CREATE SCHEMA catalog`) provides domain separation (L2-054) without managing 11 database files.
- Full-text search, JSON operators, and row-level security are available if needed.
- Universal agent knowledge — every AI agent has deep PostgreSQL expertise.
- Single connection string, single backup target, single migration pipeline.

### 5.2 Decision Trace to Requirements

| Decision | Requirements Addressed |
|----------|----------------------|
| AD-01 | L1-015, L1-016, L2-035, L2-054 |
| AD-02 | L1-010, L1-011, L1-012, L1-013, L1-019 |
| AD-03 | L1-017, L1-018, L2-039, L2-040 |
| AD-04 | L1-015, L2-046, L2-050, L2-054 |
| AD-05 | L1-015, L1-025, L2-054 |

---

## 6. Consistency and Correspondence

### 6.1 Viewpoint Correspondences

| Correspondence Rule | Viewpoints Involved | Verification |
|---------------------|---------------------|--------------|
| Every L1 requirement must be addressable by at least one route or API endpoint | Functional (4.1) ↔ Requirements (L1) | Route table covers all L1 requirements |
| Every domain schema must have corresponding API routes and client functions | Data (4.2) ↔ Development (4.3) | 11 schemas → 11 API route directories → 11 client modules |
| Auth middleware must protect all admin and teams routes | Security (4.4) ↔ Functional (4.1) | Middleware runs before `(admin)` and `(teams)` route groups |
| Every schema change must be deployable via CLI migration | Data (4.2) ↔ Deployment (4.5) | `cc migrate` operates per-schema |
| Design tokens must be the sole color source for all components | Functional (4.1) ↔ Development (4.3) | Tailwind theme config is the single source; no hardcoded hex values |

### 6.2 Requirements Traceability Matrix

| Requirement | View | Component(s) |
|-------------|------|--------------|
| L1-001 Product Catalog | 4.1 Route `/shop`, `/product/[id]`; 4.2 Schema `catalog.*` | Product pages, catalog schema, catalog API |
| L1-002 Shopping Cart | 4.1 Route `/cart` | Cart page, order schema |
| L1-003 Order Processing | 4.1 Route `/checkout`; 4.2 Schema `orders.*` | Checkout flow, order/payment API |
| L1-004 Payment Processing | 4.2 Schema `orders.payments` | Payment API routes |
| L1-005 Authentication | 4.4 Auth architecture | Auth middleware, identity API, session management |
| L1-006 Content Management | 4.1 Routes `/[slug]`, `/faq`; 4.2 Schema `content.*` | Content pages, content API |
| L1-007 Newsletter | 4.1 Newsletter signup; 4.2 Schema `newsletter.*` | Newsletter API, campaign management |
| L1-008 Inquiries | 4.1 Routes `/contact`, `/wholesale`, `/ambassador` | Inquiry form, inquiry API |
| L1-009 AI Chat | 4.1 Chat widget component | Chat container, chat API, AI service integration |
| L1-010 Multi-Brand | 4.1 Middleware routing; 4.1.4 Theming | Hostname detection, design tokens |
| L1-011 Coming Soon | 4.1 Route group `(coming-soon)` | Coming soon pages |
| L1-012 Admin Panel | 4.1 Route group `(admin)` | 20+ admin pages |
| L1-013 Team Collaboration | 4.1 Route group `(teams)`; 4.2 Real-time | Teams pages, WebSocket hub |
| L1-014 Employee Management | 4.2 Schema `scheduling.*` | Employee, meeting, schedule pages |
| L1-015 Backend Architecture | 4.2 Schema isolation; 5.1 AD-01 | PostgreSQL schemas, domain modules |
| L1-016 API Gateway | 4.1 API routes | Next.js API route handlers |
| L1-017 Responsive Design | 4.1.5 Tailwind breakpoints | Responsive layouts across all apps |
| L1-018 Design System | 4.1.4 Design tokens | Tailwind theme, Fraunces/DM Sans typography |
| L1-019 Shared Libraries | 4.3.1 Module structure | `components/`, `lib/api/`, `lib/features/` |
| L1-020 CRM | 4.2 Schema `crm.*` | CRM API, customer/lead pages |
| L1-021 Notifications | 4.2 Schema `notifications.*` | Notification API |
| L1-022 CLI Tooling | 4.5.4 CLI tool | `cc` CLI commands |
| L1-023 E2E Testing | 4.3.1 `e2e/` directory | Playwright test suites |
| L1-024 Security | 4.4 Security viewpoint | Auth, validation, HTTPS, OWASP controls |
| L1-025 Database Seeding | 4.5.5 Seeding | Idempotent seeders per schema |
| L1-026 Real-Time | 4.2.3 Real-time data flow | WebSocket server, channel groups |
| L1-027 File Management | 4.2 Schema `scheduling.files` | File upload API, S3 storage |
| L1-028 Wholesale/Ambassador | 4.1 Routes `/wholesale`, `/ambassador` | Inquiry forms with category prefixes |
| L1-029 Product Reviews | 4.2 Schema `catalog.reviews` | Review components, catalog API |
| L1-030 Customer Accounts | 4.1 Routes `/account`, `/account/orders` | Account pages, auth guards |
| L1-031 Order Management | 4.1 Admin route `/orders` | Admin order management page |
| L1-032 User Management | 4.1 Admin route `/users` | Admin user management page |
| L1-033 Email Campaigns | 4.2 Schema `newsletter.campaigns` | Campaign management pages, newsletter API |
| L1-034 Gallery Management | 4.1 Admin route `/gallery` | Gallery CRUD page, content API |
| L1-035 Category Collections | 4.1 Routes `/bundles`, `/closures`, `/frontals`, `/bundle-deals` | Collection pages with filtered product grids |

---

## 7. Appendices

### A. Glossary

| Term | Definition |
|------|-----------|
| **Domain module** | A logically independent area of business functionality (e.g., Catalog, Orders) with its own database schema, API routes, and client library |
| **Design token** | A named value (color, spacing, radius, font) that varies per brand theme, referenced by all UI components |
| **Route group** | A Next.js App Router directory prefix (e.g., `(admin)`) that provides shared layout without affecting the URL path |
| **Intelligent component** | A frontend component in the `features` module that composes UI primitives with API service calls |
| **Idempotent seeder** | A database initialization script that populates reference data only if the target tables are empty |

### B. Referenced Standards

| Standard | Application |
|----------|------------|
| ISO/IEC/IEEE 42010:2022 | Structure and content of this architecture description |
| OWASP Top 10 | Security control baseline (L1-024) |
| WCAG 2.1 AA | Accessibility target for all consumer-facing pages |

### C. Requirements Baseline Documents

- [L1 — High-Level Requirements](specs/L1.md) (35 requirements)
- [L2 — Detailed Requirements](specs/L2.md) (80 requirements with acceptance criteria)
