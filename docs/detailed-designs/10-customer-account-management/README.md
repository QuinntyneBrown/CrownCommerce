# Customer Account Management — Detailed Design

## 1. Overview

Customer account flows combine authentication, profile rendering, and order history. The design must keep auth boundaries strict while making account pages server-render friendly and keeping login/register flows predictable.

| Requirement | Summary |
|---|---|
| **L2-065** | Auth-gated account and order pages |
| **L2-066** | Login and registration |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Auth path** | Account pages were not explicitly tied to the corrected auth baseline. | Account routes now depend on `proxy.ts` plus authoritative server guards. |
| **2. Data path** | Server-rendered account pages risked self-fetching internal APIs. | Account and order views should read from domain services directly. |
| **3. Login UX** | Success behavior was too simplistic. | Login and register flows should support `returnTo` with safe redirect validation. |
| **4. Authorization** | Order detail access needed stronger wording. | A user may only view orders where `orders.userId` matches their authenticated identity. |
| **5. Abuse control** | Public login/register endpoints still needed stronger protection. | Validation, rate limiting, and normalized auth errors are mandatory. |

## 3. Target Architecture

Primary files:

- [`app/(storefront)/account/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/account/page.tsx)
- [`app/(storefront)/account/orders/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/account/orders/page.tsx)
- [`app/(storefront)/order/[id]/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/order/[id]/page.tsx)
- [`app/(storefront)/login/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/login/page.tsx)
- [`app/(storefront)/register/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/register/page.tsx)

Rules:

- Account pages are server-rendered and guard-protected.
- Order history queries paginate and sort deterministically.
- Order detail must fail closed on unauthorized access.
- Login/register mutations use the auth service boundary, not ad hoc business logic inside the page.

## 4. Performance & Code Quality Rules

- Server pages do not fetch `/api/identity/*` or `/api/orders/*` over HTTP for first-party rendering.
- Order history uses projection and pagination.
- Login/register must validate input and rate-limit failures.
- Redirect destinations are allow-listed or same-origin validated.
- Brand styling is inherited from storefront layout, but auth state remains brand-agnostic unless the data model changes.

## 5. Current Repo Gaps

- The current auth endpoint still returns the token in JSON and lacks standardized schema validation.
- Login success still defaults to a simple redirect path instead of full `returnTo` support.
- Brand scoping for order history is still a product decision rather than an implemented data contract.
- Rate limiting on login and registration is not yet in place.

## 6. Key Decisions

1. Account pages are a **guarded server-render path**.
2. Login/register remain first-party auth flows, but they still need full public-endpoint hardening.
3. Order detail authorization is enforced by identity ownership, not just route secrecy.
