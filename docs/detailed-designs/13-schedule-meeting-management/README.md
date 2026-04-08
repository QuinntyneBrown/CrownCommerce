# Schedule & Meeting Management — Detailed Design

## 1. Overview

Scheduling and meetings are administrative planning flows built on the `scheduling` schema. The design must make calendar reads efficient, keep timezone handling explicit, and move email/ICS side effects out of the hot request path where possible.

| Requirement | Summary |
|---|---|
| **L2-031** | Admin schedule calendar |
| **L2-032** | Admin meeting creation |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Query scope** | Calendar reads were described too broadly. | Schedule views query by explicit date window and optional employee filters. |
| **2. Timezone safety** | Timezone handling was left too implicit. | Meeting data is stored in UTC and converted only at render/notification boundaries. |
| **3. Side effects** | Meeting creation risked mixing persistence, email, and ICS generation in one hot request. | Meeting persistence happens first; email/ICS delivery is triggered as a follow-up workflow. |
| **4. Auth boundary** | Admin-only behavior needed stronger route-level language. | Admin APIs and UI both require admin authorization, not just admin navigation. |
| **5. Mutation quality** | RSVP and attendee changes needed clearer contracts. | Meeting and attendee mutations are explicit service operations with validation and audit-friendly state transitions. |

## 3. Target Architecture

Primary files:

- [`app/(admin)/admin/schedule/page.tsx`](C:/projects/CrownCommerce/app/(admin)/admin/schedule/page.tsx)
- [`app/(admin)/admin/meetings/page.tsx`](C:/projects/CrownCommerce/app/(admin)/admin/meetings/page.tsx)
- [`app/api/scheduling/meetings/route.ts`](C:/projects/CrownCommerce/app/api/scheduling/meetings/route.ts)
- [`app/api/scheduling/meetings/[id]/route.ts`](C:/projects/CrownCommerce/app/api/scheduling/meetings/[id]/route.ts)
- [`lib/db/schema/scheduling.ts`](C:/projects/CrownCommerce/lib/db/schema/scheduling.ts)

Rules:

- Schedule pages use windowed queries: month/week/day, not unbounded reads.
- Meeting creation writes the meeting and attendees transactionally.
- Notification or invitation side effects are triggered after the database write succeeds.
- ICS generation is server-side and deterministic.

## 4. Performance & Code Quality Rules

- Query only the time range the current calendar view needs.
- Store times in UTC; convert for display and outbound email rendering.
- Avoid recomputing attendee aggregates row-by-row in the UI.
- Meeting creation and update payloads require schema validation.
- Email delivery failures should not leave the core meeting write ambiguous.

## 5. Current Repo Gaps

- Scheduling Route Handlers still accept raw JSON and write directly to tables.
- Timezone conversion behavior is not yet implemented consistently.
- Email/ICS workflow is still a design target rather than a shared service boundary.
- Admin auth requirements should be enforced explicitly on scheduling write routes.

## 6. Key Decisions

1. Calendar queries are range-based, not table scans.
2. Meeting persistence and outbound delivery are separate concerns.
3. UTC is canonical storage format throughout the scheduling domain.
