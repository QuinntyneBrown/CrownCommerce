# Newsletter & Email Campaigns — Detailed Design

## 1. Overview

Newsletter and campaign features combine public acquisition flows with admin-only sending workflows. The design must protect the public subscription surface from abuse, keep subscriber state transitions explicit, and avoid turning campaign send operations into long synchronous web requests.

| Requirement | Summary |
|---|---|
| **L2-014** | Newsletter subscription and confirmation |
| **L2-015** | Admin subscriber management |
| **L2-071** | Campaign creation and sending |
| **L2-079** | Confirm and unsubscribe pages |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Public write safety** | Subscription was described too much like a simple insert. | Subscription becomes a validated, rate-limited, idempotent write flow with explicit pending/confirmed states. |
| **2. Token handling** | Confirm/unsubscribe tokens were not described with sufficient rigor. | Tokens should be signed or hashed, single-purpose, expiring, and safe to replay idempotently. |
| **3. Campaign execution** | Sending through a normal admin request risks long request times and partial failure. | Campaign sending is modeled as a background workflow or queued batch operation, not an inline UI mutation. |
| **4. Segmentation** | Brand segmentation rules were underspecified. | Subscriber uniqueness and filtering are explicit at the `(email, brandTag)` level. |
| **5. Auth boundary** | Admin endpoints relied too much on page-level protection in the old wording. | All campaign and privileged subscriber endpoints require explicit admin auth at the API boundary. |

## 3. Target Architecture

Primary files:

- [`components/email-signup.tsx`](C:/projects/CrownCommerce/components/email-signup.tsx)
- [`lib/features/newsletter-signup.tsx`](C:/projects/CrownCommerce/lib/features/newsletter-signup.tsx)
- [`lib/db/schema/newsletter.ts`](C:/projects/CrownCommerce/lib/db/schema/newsletter.ts)
- [`app/api/newsletter/subscribers/route.ts`](C:/projects/CrownCommerce/app/api/newsletter/subscribers/route.ts)
- [`app/api/newsletter/campaigns/route.ts`](C:/projects/CrownCommerce/app/api/newsletter/campaigns/route.ts)

Rules:

- Public subscription requests validate email, brand tag, and consent assumptions.
- Confirm and unsubscribe routes are idempotent.
- Campaign writes create recipient snapshots and delivery state transitions.
- Admin pages can use the public API layer, but server-rendered admin dashboards should not self-fetch it over HTTP.

## 4. Performance & Code Quality Rules

- Public signup writes must be rate-limited.
- Subscriber list endpoints must paginate and filter server-side.
- Campaign sending should batch recipients and persist delivery state incrementally.
- Email delivery side effects should not block the admin interface for the entire batch.
- Avoid leaking whether a given email address is already subscribed.

## 5. Current Repo Gaps

- [`app/api/newsletter/subscribers/route.ts`](C:/projects/CrownCommerce/app/api/newsletter/subscribers/route.ts) still behaves like a raw insert endpoint.
- Rate limiting and signed confirmation-token hardening are not yet implemented.
- Campaign execution is not yet described or implemented as a queue-backed workflow.
- Admin auth for newsletter mutations should be explicit at the route layer, not only implied by the admin UI.

## 6. Key Decisions

1. Newsletter signup is a **public write surface** and must be treated like one.
2. Campaign sending is a background workflow, not just a `PUT status="sending"` side effect inside a request handler.
3. Subscriber segmentation is brand-aware by design.
