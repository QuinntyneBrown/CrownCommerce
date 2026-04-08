# Admin Dashboard & Management — Detailed Design

## 1. Overview

The admin surface is the control plane for catalog, orders, CRM, content, and user operations. High-quality design here means server-rendered reads, strict admin authorization, and table/query contracts that scale without turning every page into an all-rows dump.

| Requirement | Summary |
|---|---|
| **L2-024** | Admin dashboard |
| **L2-062** | Admin sidebar navigation |
| **L2-067** | Order management |
| **L2-068** | User management |
| **L2-069** | Customer management |
| **L2-070** | Lead management |
| **L2-072** | Gallery management |
| **L2-077** | Complete admin navigation |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Route correctness** | The admin surface historically leaked old `/dashboard`-style paths. | Admin routes are explicitly `/admin/*` and the shell must link only to those paths. |
| **2. Read path** | It was easy to drift toward aggregate API endpoints for server-rendered pages. | Dashboard and table pages should compose direct server-side query services instead of self-fetching APIs. |
| **3. Query scale** | Many admin flows were compatible with returning entire tables. | Admin tables require pagination, deterministic sorting, and server-side filtering. |
| **4. Auth scope** | UI guards were clearer than API authorization. | Any admin-capable Route Handler must enforce admin auth explicitly. |
| **5. Mutation hygiene** | Status changes and CRUD flows lacked a shared mutation boundary. | Admin writes should go through domain services or Server Actions with shared validation and cache invalidation. |

## 3. Target Architecture

Primary files:

- [`app/(admin)/admin/layout.tsx`](C:/projects/CrownCommerce/app/(admin)/admin/layout.tsx)
- [`app/(admin)/admin/dashboard/page.tsx`](C:/projects/CrownCommerce/app/(admin)/admin/dashboard/page.tsx)
- [`lib/auth/guards.ts`](C:/projects/CrownCommerce/lib/auth/guards.ts)

Rules:

- [`requireAdmin()`](C:/projects/CrownCommerce/lib/auth/guards.ts) protects the admin UI tree.
- Dashboard cards and recent-activity panels use focused server-side queries, not one giant catch-all endpoint.
- CRUD tables share conventions for pagination, search, sort, and mutation feedback.

## 4. Performance & Code Quality Rules

- No admin page should read an entire large table when it only needs one page.
- Admin server pages do not fetch their own APIs over HTTP.
- All admin mutations validate inputs and invalidate only the relevant cache tags.
- Bulk operations need explicit contracts; do not tunnel them through many one-row updates from the client.
- Sidebar navigation and shell chrome should remain stable and cheap to render.

## 5. Current Repo Gaps

- Several admin APIs are still not explicitly protected with `withAdmin()`.
- Many list endpoints still return all rows.
- Some admin pages remain placeholder implementations rather than full server-driven management surfaces.
- The shell route namespace was recently corrected in code and should now be treated as canonical `/admin/*`.

## 6. Key Decisions

1. Admin reads are server-rendered and query-service-driven.
2. Admin APIs are never implicitly trusted just because the UI is behind an admin layout.
3. Pagination and filtering are mandatory platform behavior for admin tables.
