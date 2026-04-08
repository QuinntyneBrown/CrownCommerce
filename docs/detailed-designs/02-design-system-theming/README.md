# Design System & Multi-Brand Theming — Detailed Design

## 1. Overview

CrownCommerce serves two storefront brands, **Origin Hair** and **Mane Haus**, from one Next.js 16 codebase. The design system must deliver distinct brand identity without duplicating components, introducing client-side theme bootstrapping, or scattering brand conditionals across the UI tree.

| Requirement | Summary |
|---|---|
| **L2-021** | Origin storefront styling |
| **L2-022** | Mane Haus storefront styling |
| **L2-036** | Responsive storefront home page |
| **L2-037** | Responsive admin panel |
| **L2-038** | Responsive teams application |
| **L2-039** | CSS design token system |
| **L2-057** | Navigation and routing |
| **L2-058** | Home page configuration |
| **L2-061** | Mobile navigation |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Request boundary** | The document depended on `app/middleware.ts` and response headers for brand detection. | Brand resolution now happens in **root `proxy.ts`** and is propagated through **upstream request headers**. |
| **2. Styling model** | Theme behavior was described too close to concrete colors instead of stable semantic tokens. | Components consume **semantic CSS variables** such as `--background`, `--foreground`, `--accent`, and brand overrides change only tokens. |
| **3. Typography** | The old design assumed Google Fonts but the repo currently ships fallbacks. | The design now treats [`lib/theme/fonts.ts`](C:/projects/CrownCommerce/lib/theme/fonts.ts) as the current fallback layer and `next/font` as the target upgrade path. |
| **4. Performance** | Theme selection risked client-side branching and duplicate work. | Theme resolution is **server-first** and CSS-driven; no hydration is required just to know the active brand. |
| **5. Layout consistency** | Storefront, admin, teams, and coming-soon surfaces were not clearly separated. | Route-group-specific layout rules now define which surfaces inherit brand styling and which should stay operationally neutral. |

## 3. Target Architecture

### 3.1 Runtime Brand Resolution

- [`proxy.ts`](C:/projects/CrownCommerce/proxy.ts) maps hostname to brand and sets `x-brand` on the request.
- [`getBrand()`](C:/projects/CrownCommerce/lib/theme/index.ts) reads that header in server code.
- [`app/layout.tsx`](C:/projects/CrownCommerce/app/layout.tsx) sets `data-brand` on `<body>`.
- Brand resolution must never rely on `window.location` or a client bootstrap effect.

### 3.2 Token System

The token stack is:

```text
brand hostname -> x-brand request header -> data-brand attribute -> CSS variables -> components
```

Rules:

- All components consume **semantic** variables, not brand names.
- Brand overrides live in [`app/globals.css`](C:/projects/CrownCommerce/app/globals.css), not inside components.
- Layout, spacing, radius, shadow, and typography tokens should be first-class, not just colors.
- Theming must work for Server Components and static HTML without waiting for JavaScript.

### 3.3 Typography

- Current implementation uses fallback font objects from [`lib/theme/fonts.ts`](C:/projects/CrownCommerce/lib/theme/fonts.ts).
- Target implementation should use `next/font` for heading/body families with `display: "swap"`.
- Avoid inline `style={{ fontFamily: ... }}` on the root layout once the font variables are wired correctly.

### 3.4 Route-Group Rules

| Surface | Brand-Aware | Notes |
|---|---|---|
| `(storefront)` | Yes | Full brand expression |
| `(coming-soon)` | Yes | Minimal chrome, same token model |
| `(admin)` | Mostly neutral | Operational UI should prioritize clarity over luxury theming |
| `(teams)` | Mostly neutral | Productivity UI should remain dense and legible |

## 4. Performance & Code Quality Rules

- Theme selection must happen on the server, once per request.
- Do not fork components per brand unless the structure actually differs.
- Prefer CSS variables over large conditional class trees.
- Mobile nav and responsive layout behavior should be CSS-first; JavaScript should only control disclosure state.
- Shared components must never import brand-specific business logic.
- Imagery, gradients, and decorative layers should be additive and removable without changing component semantics.

## 5. Current Repo Gaps

- [`app/layout.tsx`](C:/projects/CrownCommerce/app/layout.tsx) still applies a system font inline instead of using the theme font layer cleanly.
- The font configuration file documents a future `next/font` setup but does not implement it yet.
- The docs previously described `middleware.ts`; the runtime boundary is now [`proxy.ts`](C:/projects/CrownCommerce/proxy.ts).
- Some responsive/admin/team design expectations remain design targets rather than fully realized UI behavior.

## 6. Key Decisions

1. Brand detection is a **request-time server concern**, not a client concern.
2. The design system is driven by **semantic tokens**, not duplicated branded components.
3. Storefront and coming-soon pages carry the strongest brand expression; admin and teams surfaces bias toward usability.
4. Typography should upgrade to `next/font`, but the token model should remain stable regardless of the font source.
