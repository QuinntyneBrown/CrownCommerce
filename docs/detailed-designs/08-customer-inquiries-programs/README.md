# Customer Inquiries & Programs — Detailed Design

## 1. Overview

Customer inquiries, wholesale intake, and ambassador applications all land on public forms. The design must maximize structured data quality and abuse resistance while keeping the admin review workflow simple.

| Requirement | Summary |
|---|---|
| **L2-016** | Contact form |
| **L2-017** | Wholesale inquiry form |
| **L2-018** | Ambassador application |
| **L2-019** | Admin inquiry management |
| **L2-078** | Ambassador service and status lifecycle |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Data shape** | Inquiry types were unified conceptually but not strongly typed enough. | The design now uses a discriminated inquiry model with category-specific validation. |
| **2. Public form safety** | Abuse prevention was too light for public POST endpoints. | Public inquiry submission requires rate limiting, validation, and optional anti-bot controls. |
| **3. Ambassador complexity** | Ambassador-specific data risked becoming unstructured spillover. | Ambassador data should be modeled as typed JSON validated against a schema or a dedicated extension model. |
| **4. Admin operations** | Export/search/status management were described more as UI behavior than service contracts. | Search, filter, export, and status changes are explicit server-side operations. |
| **5. Delivery boundary** | Inquiry storage and downstream notifications were blurred. | Inquiry creation persists the canonical record first; notification or CRM follow-up is a separate concern. |

## 3. Target Architecture

Primary files:

- [`lib/features/inquiry-form.tsx`](C:/projects/CrownCommerce/lib/features/inquiry-form.tsx)
- [`lib/api/inquiries.ts`](C:/projects/CrownCommerce/lib/api/inquiries.ts)
- [`lib/db/schema/inquiries.ts`](C:/projects/CrownCommerce/lib/db/schema/inquiries.ts)
- [`app/api/inquiries/route.ts`](C:/projects/CrownCommerce/app/api/inquiries/route.ts)

Rules:

- Contact, wholesale, and ambassador forms map to one inquiry service with a typed `category`.
- Admin review pages read paginated, filterable datasets.
- Status transitions are explicit and auditable.
- Export generation runs server-side and should stream or batch large datasets.

## 4. Performance & Code Quality Rules

- Public submissions must never trust raw `FormData` or JSON without schema validation.
- Admin list pages need server-side pagination and filtering.
- CSV/PDF export should not require loading the full dataset into client memory.
- Free-text fields should be sanitized before downstream rendering.
- Public write endpoints should use rate limiting and optionally honeypot or Turnstile-style defenses.

## 5. Current Repo Gaps

- [`app/api/inquiries/route.ts`](C:/projects/CrownCommerce/app/api/inquiries/route.ts) still accepts raw input without the stronger service boundary described here.
- Abuse controls are not yet implemented.
- Export workflow is still a design target rather than an implemented server path.
- Ambassador-specific modeling is not yet clearly separated from generic inquiry data.

## 6. Key Decisions

1. Public inquiry capture is a structured intake surface, not a generic message bucket.
2. The unified inquiry model remains valid, but only with strong category-level validation.
3. Admin exports and status workflows belong on the server, not in browser-only table logic.
