# Authentication & Authorization — Detailed Design

## 1. Overview

CrownCommerce uses cookie-based JWT authentication with server-side guards for protected UI and explicit authorization checks in Route Handlers. The design goal is low-latency auth checks for page navigation without weakening API security or normalizing unsafe shortcuts.

| Requirement | Summary |
|---|---|
| **L2-008** | Registration, login, profile, unauthorized handling |
| **L2-009** | Auth guards and interceptors |
| **L2-055** | Auth token security |
| **L2-056** | Input validation |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Boundary naming** | The old design centered on `middleware.ts`. | Next.js 16 now uses **root `proxy.ts`** for coarse request interception. |
| **2. Route correctness** | Protected paths were documented as `/dashboard` and `/home`, which do not match the actual app structure. | Protected UI paths are `/admin/*` and `/teams/*`, with server guards remaining authoritative. |
| **3. Auth layering** | The design blurred coarse page gating and authoritative token verification. | `proxy.ts` performs cheap cookie-presence checks; guards and Route Handlers perform full verification and role checks. |
| **4. Input and abuse control** | Login and registration were under-specified for validation and rate limiting. | All auth payloads require **Zod validation**, error normalization, and rate limiting on public endpoints. |
| **5. Session integrity** | The document did not call out current security trade-offs clearly enough. | The design now explicitly treats secret management, token revocation, and session-table usage as implementation decisions with current gaps. |

## 3. Target Architecture

### 3.1 Session Layer

Primary files:

- [`lib/auth/session.ts`](C:/projects/CrownCommerce/lib/auth/session.ts)
- [`lib/auth/guards.ts`](C:/projects/CrownCommerce/lib/auth/guards.ts)
- [`lib/auth/middleware.ts`](C:/projects/CrownCommerce/lib/auth/middleware.ts)
- [`proxy.ts`](C:/projects/CrownCommerce/proxy.ts)

Rules:

- Authentication is represented by an `auth-token` httpOnly cookie.
- JWT verification happens on the server only.
- Page/layout guards use `redirect()` for UI flows.
- Route Handlers use `401/403` JSON responses for API callers.

### 3.2 Request-Time Auth Flow

```text
Request -> proxy.ts -> layout/page guard -> route handler or server render
```

- `proxy.ts` performs fast path gating for `/admin/*` and `/teams/*`.
- [`requireAdmin()`](C:/projects/CrownCommerce/lib/auth/guards.ts) and [`requireTeamMember()`](C:/projects/CrownCommerce/lib/auth/guards.ts) remain authoritative for protected UI trees.
- [`withAuth()`](C:/projects/CrownCommerce/lib/auth/middleware.ts) and [`withAdmin()`](C:/projects/CrownCommerce/lib/auth/middleware.ts) remain authoritative for API authorization.

### 3.3 Identity API Rules

[`app/api/identity/auth/route.ts`](C:/projects/CrownCommerce/app/api/identity/auth/route.ts) is the current single auth endpoint. The target design keeps the single endpoint only if these rules are met:

- Validate `action` and request body with a discriminated union schema.
- Never trust role input from the public registration path.
- Do not expose raw tokens in the JSON response unless there is a concrete client need.
- Normalize expected auth failures as `400`, `401`, or `409`, not generic `500`.

## 4. Performance & Code Quality Rules

- Coarse page gating in `proxy.ts` must stay cheap: cookie presence only, no expensive data reads.
- Token verification should not be duplicated multiple times in the same render path unnecessarily.
- Public auth routes must be rate-limited by IP and, ideally, by credential identifier.
- Password hashing should remain server-side and configurable; do not hardcode weak cost assumptions into clients.
- A production deployment must fail closed if `AUTH_SECRET` is missing; insecure fallback secrets are development-only.

## 5. Current Repo Gaps

- [`lib/auth/session.ts`](C:/projects/CrownCommerce/lib/auth/session.ts) still contains a development secret fallback that should not survive production hardening.
- [`app/api/identity/auth/route.ts`](C:/projects/CrownCommerce/app/api/identity/auth/route.ts) performs manual branching without a unified Zod schema.
- The auth route currently returns the JWT in the response body even though it also sets the cookie.
- Rate limiting is not implemented on login or registration.
- [`identity.sessions`](C:/projects/CrownCommerce/lib/db/schema/identity.ts) exists, but the current JWT flow does not fully use it for revocation or rotation.

## 6. Key Decisions

1. `proxy.ts` is a **routing optimization**, not the sole authority for authorization.
2. Protected UI uses guards and redirects; protected APIs use explicit auth wrappers and JSON failures.
3. Auth should remain cookie-first and server-verified.
4. Rate limiting and validation are part of the auth design, not optional hardening.
