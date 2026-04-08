# Product Catalog & Search — Detailed Design

## 1. Overview

The catalog is the platform's highest-value read path. Its design must optimize for server-render performance, stable query contracts, predictable URL-driven filters, and safe write flows for admin CRUD and customer reviews.

| Requirement | Summary |
|---|---|
| **L2-001** | Product listing page |
| **L2-002** | Product detail page |
| **L2-003** | Admin product CRUD |
| **L2-004** | Admin origin management |
| **L2-059** | Bundle deals |
| **L2-064** | Product reviews |
| **L2-075** | Category collection pages |
| **L2-076** | Advanced product search |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Read path** | The old design normalized page-level fetches to `/api/catalog/*`. | Storefront and admin pages should read from **catalog domain services directly**, not self-fetch internal APIs. |
| **2. Query shape** | Catalog reads were described too loosely and risked `SELECT *` plus full-table scans. | Reads now require explicit projection, pagination, ordering, and indexed filter strategy. |
| **3. Caching** | Product and content reads were not treated as cacheable assets. | Catalog queries use tagged caches and targeted invalidation after writes. |
| **4. Write safety** | Admin writes and review creation were under-specified for validation and auth. | Admin mutations require authorization; review writes require validation, abuse controls, and moderation strategy. |
| **5. URL state** | Filtering/sorting logic was not clearly tied to route state. | Search, sort, filter, and pagination are URL-driven so pages remain shareable, cache-friendly, and testable. |

## 3. Target Architecture

### 3.1 Read Model

Primary files:

- [`lib/db/schema/catalog.ts`](C:/projects/CrownCommerce/lib/db/schema/catalog.ts)
- [`lib/api/catalog.ts`](C:/projects/CrownCommerce/lib/api/catalog.ts)
- [`lib/features/product-grid.tsx`](C:/projects/CrownCommerce/lib/features/product-grid.tsx)
- [`components/product-card.tsx`](C:/projects/CrownCommerce/components/product-card.tsx)

Target layering:

```text
Storefront page -> catalog query service -> Drizzle -> catalog schema
Client filters/reviews -> API client -> Route Handler -> catalog mutation service
```

### 3.2 Page Rules

- `/shop`, `/bundles`, `/closures`, `/frontals`, and `/bundle-deals` should use one shared query model with route-specific defaults.
- `/product/[id]` must call `notFound()` when the product does not exist.
- Product pages may load related products and reviews in parallel.
- Admin catalog pages under `/admin/*` should use paginated table queries, not full-table reads.

### 3.3 Search and Filters

The query contract should be URL-driven:

- `q`
- `category`
- `texture`
- `origin`
- `minPrice`
- `maxPrice`
- `length`
- `sort`
- `page`
- `pageSize`

Server code validates and normalizes these values before building the SQL query.

## 4. Performance & Code Quality Rules

- Server-rendered catalog pages do not call `/api/catalog/*` over HTTP.
- List queries must project only required columns for cards and tables.
- All list endpoints require deterministic ordering.
- Pagination is mandatory for admin and recommended for public list/search results.
- Category pages should not fetch all products and then filter in memory.
- Review submission must be rate-limited and validated.
- Catalog writes invalidate tags such as `catalog:products`, `catalog:origins`, and `catalog:bundle-deals`.

## 5. Current Repo Gaps

- Several storefront pages still fetch internal catalog APIs over absolute URLs with `cache: "no-store"`.
- [`app/api/catalog/products/route.ts`](C:/projects/CrownCommerce/app/api/catalog/products/route.ts) and related handlers still write/read directly from tables without a shared service layer.
- Admin write endpoints are not consistently protected by `withAdmin()`.
- Pagination, server-side search, and indexed filter strategy are still design targets rather than enforced contracts.

## 6. Key Decisions

1. Catalog reads are a **server-first query-service concern**.
2. Filters and pagination live in the URL, not only in client state.
3. Reviews are treated as a public write surface and therefore require stronger validation and abuse controls than internal admin CRUD.
4. Bundle deals remain catalog entities, but their item payload should evolve toward a typed structure rather than opaque text where possible.
