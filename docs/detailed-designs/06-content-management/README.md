# Content Management System — Detailed Design

## 1. Overview

The CMS powers dynamic pages, FAQs, testimonials, gallery assets, hero content, and trust bar items across both storefront brands. The design goal is to keep storefront rendering fast and cache-friendly while making admin writes safe, validated, and easy to invalidate.

| Requirement | Summary |
|---|---|
| **L2-010** | Dynamic content pages |
| **L2-011** | FAQ page |
| **L2-012** | Testimonials |
| **L2-013** | Gallery |
| **L2-025** | Hero content management |
| **L2-026** | Trust bar item management |
| **L2-073** | Admin page CRUD |
| **L2-074** | Admin FAQ CRUD |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Read path** | The old design described storefront Server Components consuming CMS data through internal HTTP fetches. | Storefront pages should query **content domain services directly** and reserve `/api/content/*` for browser clients and admin mutations. |
| **2. Cache strategy** | CMS reads were treated as mostly dynamic. | Content reads are ideal for tagged caches because editorial updates are infrequent relative to reads. |
| **3. Auth model** | Admin routes were protected at navigation level, but mutating CMS APIs were not fully specified. | All mutating content endpoints require admin authorization plus payload validation. |
| **4. Content shape** | Singleton-like content types and list-like content types were not clearly separated. | Hero and trust-bar design rules now distinguish singleton or per-brand records from ordinary collections. |
| **5. Gap handling** | Missing `[id]` routes and current implementation gaps were buried. | The design now treats missing CRUD coverage and route protection as explicit implementation deltas. |

## 3. Target Architecture

### 3.1 Read Model

Primary files:

- [`lib/db/schema/content.ts`](C:/projects/CrownCommerce/lib/db/schema/content.ts)
- [`lib/api/content.ts`](C:/projects/CrownCommerce/lib/api/content.ts)
- [`app/(storefront)/faq/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/faq/page.tsx)
- [`app/(storefront)/[slug]/page.tsx`](C:/projects/CrownCommerce/app/(storefront)/[slug]/page.tsx)

Rules:

- Dynamic pages resolve by `slug` and call `notFound()` when missing.
- FAQ, testimonial, gallery, hero, and trust-bar reads come from shared content query services.
- Storefront reads should use caching plus explicit invalidation tags such as `content:pages`, `content:faqs`, and `content:hero`.

### 3.2 Admin Write Model

- Admin CRUD may use Route Handlers or Server Actions, but both must delegate to shared content mutation services.
- Slugs are validated and unique.
- Rich text or HTML body content must be sanitized before render.
- Content updates trigger tag invalidation rather than relying on `cache: "no-store"` everywhere.

### 3.3 Content Type Rules

| Type | Model Rule |
|---|---|
| Pages | Unique slug, route-backed, cacheable |
| FAQs | Group by category in query layer, not only in client render logic |
| Testimonials | Ordered, publishable collection |
| Gallery | Ordered collection with safe image metadata |
| Hero | Singleton or brand-scoped singleton, not an unbounded list in practice |
| Trust Bar | Ordered collection, likely brand-scoped |

## 4. Performance & Code Quality Rules

- Storefront content pages do not fetch their own `/api/content/*` endpoints over HTTP.
- FAQ and page lookups should not read more rows than needed.
- Editorial reads are cacheable by default; writes invalidate tags.
- Admin list pages should paginate large collections.
- Image metadata should be structured and validated before persistence.

## 5. Current Repo Gaps

- The current design previously normalized internal fetches for storefront CMS reads.
- [`app/api/content/hero/route.ts`](C:/projects/CrownCommerce/app/api/content/hero/route.ts) and [`app/api/content/trust-bar/route.ts`](C:/projects/CrownCommerce/app/api/content/trust-bar/route.ts) do not yet expose the full singleton-friendly management story.
- Mutating content routes are not consistently protected by admin auth wrappers.
- Some content CRUD coverage remains partial compared with the target design.

## 6. Key Decisions

1. CMS data is **read-mostly** and should be cached accordingly.
2. Storefront rendering reads directly from content services; admin interactivity may use the public API layer.
3. Hero and trust-bar content are operationally singleton-like even if the physical schema allows more than one row.
4. Missing CRUD/auth coverage is an implementation gap, not a reason to lower design quality.
