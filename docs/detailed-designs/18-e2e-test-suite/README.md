# E2E Test Suite — Detailed Design

## 1. Overview

The Playwright suite provides smoke coverage for storefront, admin, and teams surfaces. The design must be grounded in the actual repo, prioritize deterministic high-signal tests, and avoid inflating the documented scope beyond what exists today.

| Requirement | Summary |
|---|---|
| **L2-048** | Consumer storefront E2E coverage |
| **L2-049** | Admin and teams E2E coverage |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Current-state accuracy** | The old draft claimed a 732-test suite that does not exist. | The design now reflects the current lightweight suite and a realistic growth path. |
| **2. Route correctness** | Test examples still used stale `/dashboard` and `/home` paths. | Canonical protected-route checks now target `/admin/dashboard` and `/teams/home`. |
| **3. Fixture maturity** | The fixture layer was described as richer than it is. | The design now treats [`e2e/fixtures/index.ts`](C:/projects/CrownCommerce/e2e/fixtures/index.ts) as a minimal base for future helpers. |
| **4. Mocking strategy** | Blanket API mocking was overstated. | The preferred strategy is deterministic seed data plus selective mocking only where external dependencies demand it. |
| **5. CI realism** | Scope and coverage ambitions were disconnected from current implementation. | The suite is defined as a smoke-first foundation that can expand around critical user journeys. |

## 3. Target Architecture

Primary files:

- [`playwright.config.ts`](C:/projects/CrownCommerce/playwright.config.ts)
- [`e2e/fixtures/index.ts`](C:/projects/CrownCommerce/e2e/fixtures/index.ts)
- [`e2e/storefront/home.spec.ts`](C:/projects/CrownCommerce/e2e/storefront/home.spec.ts)
- [`e2e/admin/login.spec.ts`](C:/projects/CrownCommerce/e2e/admin/login.spec.ts)
- [`e2e/teams/login.spec.ts`](C:/projects/CrownCommerce/e2e/teams/login.spec.ts)

Rules:

- Separate Playwright projects for storefront, admin, and teams remain valid.
- Smoke tests verify route protection and basic rendering.
- Business-critical flows expand next: auth, catalog, checkout, admin CRUD, and teams collaboration.
- Use seeded or deterministic data where possible before reaching for heavy mocks.

## 4. Performance & Code Quality Rules

- Keep tests deterministic and route-correct.
- Prefer a small set of high-signal end-to-end tests over broad but brittle UI snapshots.
- Use trace-on-retry and HTML reporting as configured.
- Add fixtures for auth setup once the suite grows beyond smoke coverage.
- Mock only true external dependencies or unstable boundaries, not the entire app by default.

## 5. Current Repo Gaps

- The current suite is intentionally small and does not cover core business flows yet.
- [`e2e/fixtures/index.ts`](C:/projects/CrownCommerce/e2e/fixtures/index.ts) is still minimal.
- Existing admin and teams smoke tests needed route updates to match the corrected app paths.

## 6. Key Decisions

1. The documented suite should match the real suite.
2. Route-correct smoke tests are the minimum viable E2E baseline.
3. Deterministic data and selective mocking beat exaggerated test counts.
