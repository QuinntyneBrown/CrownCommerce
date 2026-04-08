# Coming Soon Pages — Detailed Design

## 1. Overview

The coming-soon surfaces are lightweight brand landing pages that should load quickly, inherit the multi-brand theming system cleanly, and reuse newsletter signup without carrying the full storefront shell.

| Requirement | Summary |
|---|---|
| **L2-023** | Coming soon pages |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Render model** | The old draft did not emphasize how static these pages should be. | Coming-soon pages are designed as highly cacheable, mostly static branded pages. |
| **2. Theme consistency** | Brand theming risked diverging from the main storefront model. | The same `proxy.ts -> getBrand() -> data-brand -> CSS tokens` flow remains canonical. |
| **3. JS budget** | Decorative behavior risked becoming heavier than necessary. | Only the countdown and signup interaction justify client-side JavaScript. |
| **4. Signup safety** | Newsletter signup reuse needed public-endpoint hardening. | Coming-soon signup inherits newsletter validation and rate limiting requirements. |
| **5. UX scope** | The draft mixed launch communication and broader storefront concerns. | The design now keeps the pages intentionally narrow and fast. |

## 3. Target Architecture

Primary files:

- [`app/(coming-soon)/layout.tsx`](C:/projects/CrownCommerce/app/(coming-soon)/layout.tsx)
- [`app/(coming-soon)/origin/page.tsx`](C:/projects/CrownCommerce/app/(coming-soon)/origin/page.tsx)
- [`app/(coming-soon)/mane-haus/page.tsx`](C:/projects/CrownCommerce/app/(coming-soon)/mane-haus/page.tsx)

Rules:

- Pages are mostly static and cacheable.
- Brand styling reuses the shared token system.
- Countdown logic is a small client component with explicit cleanup.
- Signup interactions reuse the newsletter service boundary.

## 4. Performance & Code Quality Rules

- Keep the JavaScript footprint minimal.
- Use optimized images and avoid heavy above-the-fold animations.
- Countdown logic should pause or clean up correctly when the component unmounts.
- Newsletter signup uses the same abuse protections as any other public subscription surface.

## 5. Current Repo Gaps

- Newsletter hardening still depends on Feature 07 follow-up work.
- Countdown and launch-date configuration remain a design target rather than a strongly typed content model.

## 6. Key Decisions

1. Coming-soon pages are **branding surfaces first, application surfaces second**.
2. They reuse the shared theme system and newsletter service rather than inventing feature-local variants.
