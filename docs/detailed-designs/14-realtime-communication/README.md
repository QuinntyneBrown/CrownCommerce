# Real-Time Communication — Detailed Design

## 1. Overview

Realtime communication covers channel events, presence, typing, and file attachment transport for the teams experience. The most important correction in this design is architectural: **long-lived realtime connections should not be modeled as a generic Next.js Route Handler concern inside the main web app runtime**.

| Requirement | Summary |
|---|---|
| **L2-051** | Realtime communication hub |
| **L2-052** | File upload and management |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Runtime model** | The old design leaned toward a WebSocket hub living directly inside the Next.js app. | High-quality design uses a **dedicated realtime service or managed provider** for persistent connections. |
| **2. Deployment realism** | The document underplayed the constraints of serverless-style request lifecycles. | Realtime transport is separated from standard page/API request handling. |
| **3. Presence storage** | Presence and typing risked being written directly to PostgreSQL too often. | High-frequency presence/typing should live in ephemeral memory or a dedicated fast store, with PostgreSQL reserved for durable events. |
| **4. File upload safety** | Presigned upload flow needed stronger constraints. | Upload design now requires content-type, size, TTL, and post-upload metadata validation. |
| **5. Current-state accuracy** | The repo does not actually implement the hub described in the old draft. | The design now clearly marks the realtime layer as future architecture beyond the current typed event definitions. |

## 3. Target Architecture

Primary files and related artifacts:

- [`lib/realtime/index.ts`](C:/projects/CrownCommerce/lib/realtime/index.ts)
- [`app/api/scheduling/channels/[id]/messages/route.ts`](C:/projects/CrownCommerce/app/api/scheduling/channels/[id]/messages/route.ts)
- [`app/api/scheduling/files/route.ts`](C:/projects/CrownCommerce/app/api/scheduling/files/route.ts)

Target boundary:

```text
Browser client <-> dedicated realtime service / managed provider
Next.js app <-> auth tokens, message persistence, presigned upload issuance
PostgreSQL <-> durable messages and file metadata
```

Rules:

- Next.js issues auth tokens or session assertions for the realtime layer.
- Durable chat messages live in PostgreSQL.
- Typing and transient presence do not require a database write on every event.
- File uploads use presigned URLs or an equivalent object-storage flow.

## 4. Performance & Code Quality Rules

- Do not run long-lived socket state inside generic request/response handlers.
- Keep ephemeral presence data out of PostgreSQL hot loops.
- Limit upload size and content type before issuing presigned URLs.
- Validate uploaded metadata after the object is written.
- Realtime messages must degrade gracefully to polling or eventual refresh if the transport is unavailable.

## 5. Current Repo Gaps

- The repo currently exposes typed realtime events in [`lib/realtime/index.ts`](C:/projects/CrownCommerce/lib/realtime/index.ts) but no actual hub/service implementation.
- No object-storage adapter or presigned upload flow is implemented.
- Presence and typing infrastructure are design targets only.

## 6. Key Decisions

1. Persistent realtime transport is **not** a generic Route Handler feature.
2. Durable messages and ephemeral presence have different storage needs.
3. The current codebase has foundational types, not a production realtime stack.
