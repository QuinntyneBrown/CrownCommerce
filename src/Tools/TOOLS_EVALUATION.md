# CrownCommerce CLI Tools Evaluation

All tools are .NET 9 CLI applications built with `System.CommandLine`. Each follows a consistent architecture: `Commands/` (CLI definition), `Services/` (interface + implementation), and a `tests/` project using xUnit + NSubstitute.

## Completeness Legend

| Rating | Meaning |
|--------|---------|
| **Complete** | Full src + tests, service implementation with real logic |
| **Scaffold** | Full src + tests, but service methods are stubs (log-only, no real I/O) |
| **Incomplete** | Missing src project entirely; only tests or partial structure exist |

---

## Tool Summary

| # | Tool | Completeness | Subcommands | Tests | Description |
|---|------|-------------|-------------|-------|-------------|
| 1 | **Cli.Cron** | Scaffold | 4 | 1 | Local job scheduler for recurring background tasks |
| 2 | **Cli.Db** | Incomplete | ? | 1 | Database connection string and management utility |
| 3 | **Cli.Deploy** | Scaffold | 4 | 1 | Azure deployment orchestrator for services and frontends |
| 4 | **Cli.Email** | Scaffold | 5 | 1 | Email campaign and transactional mailer with SMTP trap |
| 5 | **Cli.Env** | Scaffold | 5 | 1 | Environment health checker, port manager, and process launcher |
| 6 | **Cli.Gen** | Scaffold | 4 | 1 | Code scaffolder for entities, consumers, services, and pages |
| 7 | **Cli.Logs** | Scaffold | 1 | 1 | Centralized log viewer with filtering and search |
| 8 | **Cli.Migrate** | Complete | 3 | 1 | EF Core database migration manager (runs real `dotnet ef` commands) |
| 9 | **Cli.Schedule** | Scaffold | 4 | 1 | Meeting and schedule manager with timezone support |
| 10 | **Cli.Seed** | Scaffold | 1 | 1 | Database seeder with profile support and dry-run mode |
| 11 | **Cli.Sync** | Scaffold | 5 | 1 | Timezone-aware collaboration tool with handoffs and focus mode |
| 12 | **Cli.Team** | Scaffold | 4 | 1 | Team member CRUD across Identity and Scheduling services |
| 13 | **Cli.Verify** | Complete | 1 | 4 | Deployment verification CLI querying real Newsletter database |

---

## Detailed Evaluations

### 1. CrownCommerce.Cli.Cron

**Description:** Local job scheduler for recurring background tasks (cart cleanup, follow-up reminders, meeting notifications, subscriber digests, presence sync, log archival).

**Subcommands:** `list`, `run <job-name>`, `start [--job]`, `history [job-name]`

**Completeness: Scaffold** — Jobs are defined as in-memory static data. `RunJobAsync` logs but doesn't execute real work. `StartDaemonAsync` doesn't actually schedule anything. History returns hardcoded timestamps.

---

### 2. CrownCommerce.Cli.Db

**Description:** Database connection string and management utility.

**Completeness: Incomplete** — The `src/` directory does not exist. Only a solution file and a test project remain. The test references `DbCommand.Create()` and `IDatabaseService.GetConnectionStringAsync()`, confirming the intended API, but no implementation is present.

---

### 3. CrownCommerce.Cli.Deploy

**Description:** Azure deployment orchestrator targeting Container Apps (backend) and Static Web Apps (frontend).

**Subcommands:** `service <name> --env`, `frontend <name> --env`, `status --env`, `all --env [--dry-run]`

**Completeness: Scaffold** — Validates service/frontend names against known lists and logs what `az` commands *would* run, but never actually executes them. Dry-run mode is implemented. Status returns hardcoded "running"/"deployed" for all components.

---

### 4. CrownCommerce.Cli.Email

**Description:** Email campaign and transactional mailer with template management and local SMTP trap.

**Subcommands:** `send --to --template [--data]`, `preview <template>`, `templates`, `campaign --subject --template --tag [--test-to]`, `server [--port]`

**Completeness: Scaffold** — Templates are hardcoded in-memory. All send/campaign/server operations only log; no actual SMTP or email provider integration exists.

---

### 5. CrownCommerce.Cli.Env

**Description:** Environment health checker, port registry, and process launcher for the full CrownCommerce stack.

**Subcommands:** `health [--env]`, `databases`, `ports`, `up [--services] [--frontends]`, `down`

**Completeness: Scaffold** — Port map is accurate and complete (18 entries covering all services, infra, and frontends). Health check, start, and stop operations only log; they don't perform real HTTP checks or process management.

---

### 6. CrownCommerce.Cli.Gen

**Description:** Code scaffolder for generating entities, MassTransit consumers, full microservice scaffolds, and Angular pages.

**Subcommands:** `entity <service> <entity-name>`, `consumer <service> <event-name>`, `service <service-name>`, `page <app> <page-name>`

**Completeness: Scaffold** — Logs the file paths that *would* be created but doesn't generate any actual files. Path conventions match the project structure (e.g., `Core/Entities/`, `Infrastructure/Data/`, `Api/Controllers/`).

---

### 7. CrownCommerce.Cli.Logs

**Description:** Centralized log viewer with multi-service tailing, level/search filtering, time windows, and file output.

**Subcommands:** Root command with options: `--service` (multi), `--level`, `--search`, `--since`, `--output`

**Completeness: Scaffold** — Accepts all filter options but only prints a placeholder message. No connection to Aspire structured logs or any log source.

---

### 8. CrownCommerce.Cli.Migrate

**Description:** EF Core database migration manager for all 11 microservices.

**Subcommands:** `add <service> <name>`, `apply <service> [--env]`, `status [--env]`

**Completeness: Complete** — `add` and `apply` launch real `dotnet ef` processes with correct project paths and DbContext names for all 11 services. `status` currently returns placeholder counts (0/0) but the framework is wired up. This is the most functionally complete tool alongside Verify.

---

### 9. CrownCommerce.Cli.Schedule

**Description:** Meeting and schedule manager with timezone-aware availability.

**Subcommands:** `meetings [--week] [--for]`, `create-meeting --title --start --duration --attendees [--location]`, `channels [--type]`, `availability --date`

**Completeness: Scaffold** — Returns hardcoded sample data (3 meetings, 7 channels, 5 team member availability slots). Meeting creation only logs. No real calendar or API integration.

---

### 10. CrownCommerce.Cli.Seed

**Description:** Database seeder with profile-based data generation and dry-run support.

**Subcommands:** Root command: `<service|all> [--profile] [--reset] [--dry-run]`

**Completeness: Scaffold** — Validates service names and profile names (`minimal`, `demo`, `load-test`, `e2e`). Supports seeding individual or all services. Only logs operations; no actual database writes.

---

### 11. CrownCommerce.Cli.Sync

**Description:** Timezone-aware collaboration tool for distributed teams.

**Subcommands:** `now`, `handoff --to --message`, `inbox`, `overlap <members...>`, `focus --duration --message`

**Completeness: Scaffold** — `now` and `overlap` contain **real logic** (timezone conversion using `TimeZoneInfo`, working-hour overlap calculation). `handoff`, `inbox`, and `focus` are log-only stubs with no persistence.

---

### 12. CrownCommerce.Cli.Team

**Description:** Team member management across Identity and Scheduling services.

**Subcommands:** `list [--department] [--status]`, `add --email --first-name --last-name [--role] [--job-title] [--department] [--timezone]`, `show <email>`, `deactivate <email>`

**Completeness: Scaffold** — Data comes from a hardcoded in-memory list (5 team members). List/show support filtering. Add and deactivate only log; no API or database integration.

---

### 13. CrownCommerce.Cli.Verify

**Description:** Deployment verification CLI that queries the real Newsletter database for coming-soon subscribers.

**Subcommands:** `list-subscribers [--tag]`

**Completeness: Complete** — Queries the real `NewsletterDbContext` using EF Core with proper `Include`, filtering, ordering, and projection. Has 4 integration tests using in-memory database covering filtering, ordering, and edge cases. The only tool with real database integration and meaningful test coverage.

---

## Test Coverage Summary

| Tool | Unit Tests | Integration Tests | Total |
|------|-----------|-------------------|-------|
| Cli.Cron | 1 | 0 | 1 |
| Cli.Db | 1 | 0 | 1 |
| Cli.Deploy | 1 | 0 | 1 |
| Cli.Email | 1 | 0 | 1 |
| Cli.Env | 1 | 0 | 1 |
| Cli.Gen | 1 | 0 | 1 |
| Cli.Logs | 1 | 0 | 1 |
| Cli.Migrate | 1 | 0 | 1 |
| Cli.Schedule | 1 | 0 | 1 |
| Cli.Seed | 1 | 0 | 1 |
| Cli.Sync | 1 | 0 | 1 |
| Cli.Team | 1 | 0 | 1 |
| Cli.Verify | 0 | 4 | 4 |
| **Total** | **12** | **4** | **16** |

All unit tests follow a single pattern: mock the service, invoke one subcommand, assert exit code 0 and that the service method was called. Only Verify has multi-scenario integration tests.

## Overall Assessment

- **2 tools are complete** (Migrate, Verify) with real I/O and meaningful implementations
- **11 tools are scaffolds** with full CLI wiring, proper command structure, and DI, but stub service implementations that only log
- **1 tool is incomplete** (Db) with no source project at all
- All scaffolded tools have accurate domain knowledge (service names, ports, project paths) baked into their implementations, making them ready for real integration work
