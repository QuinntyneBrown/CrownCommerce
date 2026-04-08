# CLI Tooling & Database Seeding — Detailed Design

## 1. Overview

The `cc` CLI is the developer automation entry point for CrownCommerce. The design must be honest about the current implementation, avoid unsafe production migration shortcuts, and keep command handlers modular and testable.

| Requirement | Summary |
|---|---|
| **L2-046** | CLI migration tooling |
| **L2-047** | CLI deploy tooling |
| **L2-050** | Database auto-seeding |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Current-state accuracy** | The old design described a much more complete CLI than the repo actually contains. | The design now treats [`cc/index.ts`](C:/projects/CrownCommerce/cc/index.ts) as a lightweight dispatcher with future command growth. |
| **2. Migration safety** | `drizzle-kit push` was too casually positioned for general deployment workflows. | Production migration flow should prefer checked-in generated migrations, not ad hoc schema pushes. |
| **3. Schema counting** | The doc repeated the old “11 schemas” phrasing. | The CLI now aligns with the corrected platform baseline: **10 PostgreSQL schemas, 11 domain modules**. |
| **4. Command structure** | Commands needed clearer modular ownership and exit behavior. | Each command should live in its own module with explicit exit codes, stdout/stderr handling, and dry-run support where relevant. |
| **5. Seed execution** | Seeder behavior needed stronger reliability language. | Seed operations must be idempotent, awaited, and observable. |

## 3. Target Architecture

Primary file:

- [`cc/index.ts`](C:/projects/CrownCommerce/cc/index.ts)

Target structure:

```text
cc/index.ts
cc/commands/
  health.ts
  seed.ts
  migrate.ts
  deploy.ts
  scaffold.ts
```

Rules:

- `health` reports environment readiness.
- `seed` invokes idempotent seeders and waits for completion.
- `migrate` operates on checked-in migrations and supports dry-run/status flows.
- `deploy` orchestrates app-level deployment tasks rather than pretending each domain is a separately deployed service.

## 4. Performance & Code Quality Rules

- CLI commands must return explicit exit codes.
- Long-running commands should stream progress rather than only printing at the end.
- Production migration commands should not rely on `drizzle-kit push`.
- Seeder execution must be awaited and failure-visible.
- Command modules should be testable in-process without spawning a shell for every unit of logic.

## 5. Current Repo Gaps

- [`cc/index.ts`](C:/projects/CrownCommerce/cc/index.ts) currently implements only help, health, and a minimal seed trigger; most commands are placeholders.
- The old design overstated command coverage and schema count.
- Dry-run, modular command handlers, and robust migration workflow are not implemented yet.

## 6. Key Decisions

1. The CLI is real, but currently minimal.
2. Production-safe migration design favors generated migration files over direct schema pushes.
3. Seeder reliability and visibility matter more than command count.
