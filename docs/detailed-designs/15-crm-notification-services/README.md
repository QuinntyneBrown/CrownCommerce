# CRM & Notification Services — Detailed Design

## 1. Overview

CRM and notifications combine internal data management with event-driven user feedback. The design must support efficient admin workflows, scoped recipient access, and a clean internal dispatch boundary so business events do not spread notification logic across the codebase.

| Requirement | Summary |
|---|---|
| **L2-044** | CRM customer and lead management |
| **L2-045** | Notification service |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Read scaling** | Customers, leads, and notifications risked all-row list behavior. | All list reads now require pagination, filtering, and deterministic sort order. |
| **2. Event boundary** | Notification creation was described as a broad side effect with no clear owner. | A dedicated internal dispatcher/service owns notification creation from domain events. |
| **3. Recipient scoping** | Notification access needed stronger scoping rules. | Notification reads and writes are recipient-scoped and role-aware. |
| **4. UI/data split** | Admin pages and APIs were not clearly separated for server reads vs client mutations. | Server-rendered admin views read directly from services; public APIs remain thin mutation boundaries. |
| **5. Current-state accuracy** | The old document implied internal dispatcher coverage that the repo does not yet provide. | The design now treats dispatcher and event integration as explicit implementation work. |

## 3. Target Architecture

Primary files:

- [`app/api/crm/customers/route.ts`](C:/projects/CrownCommerce/app/api/crm/customers/route.ts)
- [`app/api/crm/leads/route.ts`](C:/projects/CrownCommerce/app/api/crm/leads/route.ts)
- [`app/api/notifications/route.ts`](C:/projects/CrownCommerce/app/api/notifications/route.ts)
- [`lib/db/schema/crm.ts`](C:/projects/CrownCommerce/lib/db/schema/crm.ts)
- [`lib/db/schema/notifications.ts`](C:/projects/CrownCommerce/lib/db/schema/notifications.ts)

Rules:

- CRM list views are paginated, searchable, and filterable.
- Notification creation is owned by a dispatcher or shared service, not by ad hoc inline table writes in every feature.
- Notification consumers may request unread counts and paged history separately.

## 4. Performance & Code Quality Rules

- Do not return all customers, leads, or notifications by default.
- Unread-count queries should be cheap and explicit.
- Notification writes should be deduplicated where domain events may repeat.
- Recipient authorization must be checked at the route/service boundary.
- Use targeted invalidation for notification counters and lead/customer lists after writes.

## 5. Current Repo Gaps

- No shared notification dispatcher service exists yet.
- CRM and notification endpoints still need stronger pagination, filtering, and auth enforcement.
- Some list routes still map directly to table reads without a service layer.

## 6. Key Decisions

1. CRM data and notification delivery share infrastructure but remain separate concerns.
2. Notifications are created from domain events through a dedicated boundary.
3. Recipient scoping is enforced explicitly, not inferred from UI context.
