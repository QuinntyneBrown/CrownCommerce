# Team Collaboration Platform — Detailed Design

## 1. Overview

The teams surface gives internal staff a workspace for home/activity views, chat, meetings, and team directory data. The design must align with the corrected `/teams/*` route model, keep the primary data path server-first where possible, and avoid pretending that a full realtime stack already exists when it does not.

| Requirement | Summary |
|---|---|
| **L2-027** | Teams home |
| **L2-028** | Chat channels |
| **L2-029** | Meeting management |
| **L2-030** | Team directory |
| **L2-033** | Admin conversations |
| **L2-034** | Admin employee management |
| **L2-053** | Employee presence |
| **L2-063** | Teams sidebar |
| **L2-080** | Teams login |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Framework/version drift** | The old document still referenced Next.js 15. | The feature now aligns with the Next.js 16 platform baseline. |
| **2. Route correctness** | The document referenced `/home`, `/chat`, and `/team` directly. | Canonical teams routes are `/teams/home`, `/teams/chat`, `/teams/meetings`, and `/teams/team`. |
| **3. Data boundary** | Server/UI reads were too loosely tied to API clients. | Server-rendered teams pages should query scheduling services directly where possible. |
| **4. Presence/realtime scope** | The document risked implying a fully implemented realtime system. | Polling is acceptable for now; richer realtime belongs to Feature 14 and requires a separate boundary. |
| **5. Auth model** | Teams UI guards were clear, but API auth needed stronger emphasis. | `requireTeamMember()` protects the UI tree and API routes still verify authorization independently. |

## 3. Target Architecture

Primary files:

- [`app/(teams)/teams/layout.tsx`](C:/projects/CrownCommerce/app/(teams)/teams/layout.tsx)
- [`app/(teams)/teams/home/page.tsx`](C:/projects/CrownCommerce/app/(teams)/teams/home/page.tsx)
- [`app/(teams)/teams/chat/page.tsx`](C:/projects/CrownCommerce/app/(teams)/teams/chat/page.tsx)
- [`app/(teams)/teams/meetings/page.tsx`](C:/projects/CrownCommerce/app/(teams)/teams/meetings/page.tsx)
- [`app/(teams)/teams/team/page.tsx`](C:/projects/CrownCommerce/app/(teams)/teams/team/page.tsx)
- [`lib/db/schema/scheduling.ts`](C:/projects/CrownCommerce/lib/db/schema/scheduling.ts)

Rules:

- The teams layout is guard-protected with `requireTeamMember()`.
- Home, meeting, and directory views should use direct server-side queries where possible.
- Chat and presence may rely on client-side polling or a dedicated realtime layer, but not on hidden server-to-server fetches inside pages.

## 4. Performance & Code Quality Rules

- Use paginated message queries for chat history.
- Do not poll every page for every team datum; only live surfaces should refresh frequently.
- Times are stored in UTC and rendered in the viewer's timezone.
- Directory and meeting pages should not fetch more rows than needed for the current view.
- Realtime behavior beyond polling should be delegated to Feature 14's dedicated architecture.

## 5. Current Repo Gaps

- The route names in the old design were stale; runtime paths are now `/teams/*`.
- Chat, directory, and meeting pages are still light implementations compared with the target product behavior.
- A full realtime transport is not implemented yet.
- API authorization and pagination are still incomplete for some scheduling endpoints.

## 6. Key Decisions

1. Teams routes are **namespaced under `/teams/*`** and should remain so everywhere, including tests and docs.
2. Teams pages are server-first for stable reads and selectively client-driven for live interaction.
3. Polling is an acceptable bridge until a dedicated realtime layer exists.
