# Live Chat & AI Integration — Detailed Design

## 1. Overview

The storefront chat experience should feel responsive and helpful, but it must also control cost, rate, and failure behavior. High-quality design here means treating AI chat as a streaming application feature, not as a sequence of loosely related REST inserts.

| Requirement | Summary |
|---|---|
| **L2-020** | Floating chat widget with AI-generated responses |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Conversation lifecycle** | The current widget creates a new conversation per message. | A conversation should be created once per session or lazily on first send, then reused. |
| **2. Transport model** | The old design mixed chat persistence and AI response generation too casually. | Browser chat uses one streaming boundary for AI responses and a shared service for persistence. |
| **3. Failure handling** | Fallback behavior for model failure or quota issues was too vague. | The design now requires deterministic fallback messages and observable error states. |
| **4. Cost control** | Token budget, abuse, and prompt safety were under-specified. | Rate limits, prompt shaping, and server-side guardrails are first-class design rules. |
| **5. Product data access** | AI answers risked drifting from actual catalog data. | Any catalog-aware assistant logic must use server-side tools or query services, never client-trusted data. |

## 3. Target Architecture

Primary files:

- [`components/chat-widget.tsx`](C:/projects/CrownCommerce/components/chat-widget.tsx)
- [`lib/features/chat-container.tsx`](C:/projects/CrownCommerce/lib/features/chat-container.tsx)
- [`lib/db/schema/chat.ts`](C:/projects/CrownCommerce/lib/db/schema/chat.ts)
- [`app/api/chat/conversations/route.ts`](C:/projects/CrownCommerce/app/api/chat/conversations/route.ts)
- [`app/api/chat/conversations/[id]/messages/route.ts`](C:/projects/CrownCommerce/app/api/chat/conversations/[id]/messages/route.ts)

Target flow:

- Create or resume conversation.
- Append validated user message.
- Stream assistant response from a server-side AI boundary.
- Persist assistant output after the stream completes.
- Surface deterministic fallback UI on failure.

## 4. Performance & Code Quality Rules

- Do not create a new conversation for every message.
- Use streaming for assistant output to reduce perceived latency.
- Rate-limit by IP, session, or conversation.
- Bound message history and summarize older turns server-side when needed.
- Keep model prompts free of customer secrets and unsupported promises.
- If the assistant references catalog facts, source them from server-side queries.

## 5. Current Repo Gaps

- [`components/chat-widget.tsx`](C:/projects/CrownCommerce/components/chat-widget.tsx) currently posts a user message and then appends a canned assistant response.
- No actual AI streaming boundary is implemented yet.
- Cost control, moderation, and rate limiting are not present.
- [`lib/features/chat-container.tsx`](C:/projects/CrownCommerce/lib/features/chat-container.tsx) is currently a thin wrapper rather than a true orchestration layer.

## 6. Key Decisions

1. AI chat is designed as a **streaming server feature**, not a chain of synchronous REST calls.
2. Conversation identity must be stable across turns.
3. Guardrails and cost controls are part of the feature design, not later hardening.
