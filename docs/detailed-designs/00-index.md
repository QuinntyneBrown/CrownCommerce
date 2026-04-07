# Detailed Designs — Index

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 01 | [Platform Architecture & API Gateway](01-platform-architecture/README.md) | Draft | Modular monolith architecture, 11-domain pgSchema isolation, API gateway routing, 3-tier frontend module hierarchy (components → api → features), error handling and loading states covering L2-035, L2-054, L2-040, L2-041, L2-042, L2-043, L2-060 |
| 02 |[Design System & Multi-Brand Theming](02-design-system-theming/README.md) | Draft | CSS design token system, hostname-based brand detection, responsive layout strategies, and brand-aware component architecture covering L2-039, L2-021, L2-022, L2-036, L2-037, L2-038, L2-057, L2-058, L2-061 |
| 04 |[Product Catalog & Search](04-product-catalog/README.md) | Draft | Product browsing, search, filtering, category collections, reviews, bundle deals, and admin CRUD covering L2-001 through L2-004, L2-059, L2-064, L2-075, L2-076 |
| 05 |[Shopping Cart & Checkout](05-shopping-cart-checkout/README.md) | Draft | Cart management, multi-step checkout flow, and payment lifecycle (create, confirm, refund) covering L2-005, L2-006, L2-007 |
| 06 | [Content Management System](06-content-management/README.md) | Draft | Dynamic pages, FAQs, testimonials, gallery, hero content, trust bar — 6 content types with admin CRUD covering L2-010 through L2-013, L2-025, L2-026, L2-073, L2-074 |
| 07 | [Newsletter & Email Campaigns](07-newsletter-email-campaigns/README.md) | Draft | Subscriber acquisition with double opt-in, brand-scoped management, campaign creation/scheduling/delivery via Resend, and token-based confirm/unsubscribe pages |
| 08 | [Customer Inquiries & Programs](08-customer-inquiries-programs/README.md) | Draft | Unified inquiry intake for contact, wholesale, and ambassador applications with category-based differentiation, extended ambassador fields, and admin management with export |
| 09 | [Live Chat & AI Integration](09-live-chat-ai/README.md) | Draft | Floating chat widget with Vercel AI SDK streaming, OpenAI GPT-4o-mini responses, conversation persistence, and presentational/intelligent component split |
| 10 | [Customer Account Management](10-customer-account-management/README.md) | Draft | Customer login, registration, profile, order history, and auth-gated account pages |
| 11 | [Admin Dashboard & Management](11-admin-dashboard/README.md) | Draft | Admin dashboard with multi-schema aggregation, sidebar navigation (20+ pages), and CRUD management for orders, users, customers, leads, and gallery |
| 12 | [Team Collaboration Platform](12-team-collaboration/README.md) | Draft | Chat channels, meeting management, team directory, presence tracking, and admin employee management covering L2-027, L2-028, L2-029, L2-030, L2-033, L2-034, L2-053, L2-063, L2-080 |
| 15 | [CRM & Notification Services](15-crm-notification-services/README.md) | Draft | Customer relationship management, lead pipeline tracking, and system-wide notifications |
