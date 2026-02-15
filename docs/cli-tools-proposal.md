# Crown Commerce CLI Tools Proposal

A suite of C# CLI tools built as a single `dotnet tool` called **`cc`** (Crown Commerce) to accelerate development, deployment, and operations across the 11-microservice platform. Each subcommand targets a specific pain point in the daily workflow.

> **Architecture**: Single .NET 9 console app using `System.CommandLine`, packaged as a dotnet global tool. Each tool is a subcommand (e.g., `cc migrate`, `cc deploy`). Shared infrastructure for database connections, Azure credentials, and configuration.

---

## Tool Rankings

| Rank | Tool | Impact | Effort | Category |
|------|------|--------|--------|----------|
| 1 | [`cc migrate`](#1-cc-migrate--database-migration-manager) | Critical | Medium | Database |
| 2 | [`cc deploy`](#2-cc-deploy--azure-deployment-orchestrator) | Critical | High | DevOps |
| 3 | [`cc db`](#3-cc-db--database-operations) | High | Medium | Database |
| 4 | [`cc seed`](#4-cc-seed--intelligent-seeder) | High | Low | Database |
| 5 | [`cc cron`](#5-cc-cron--local-job-scheduler) | High | Medium | Automation |
| 6 | [`cc email`](#6-cc-email--email-campaign--transactional-mailer) | High | Medium | Communication |
| 7 | [`cc team`](#7-cc-team--team-member-management) | Medium | Low | Operations |
| 8 | [`cc schedule`](#8-cc-schedule--meeting--schedule-manager) | Medium | Low | Operations |
| 9 | [`cc env`](#9-cc-env--environment--health-manager) | Medium | Low | DevOps |
| 10 | [`cc sync`](#10-cc-sync--timezone-aware-collaboration) | Medium | Medium | Collaboration |
| 11 | [`cc logs`](#11-cc-logs--centralized-log-viewer) | Medium | Low | Observability |
| 12 | [`cc gen`](#12-cc-gen--code-scaffolder) | Low | Medium | Productivity |

---

## Detailed Tool Descriptions

---

### 1. `cc migrate` — Database Migration Manager

**Priority**: CRITICAL
**Why it matters**: The platform currently uses `EnsureCreatedAsync()` across all 11 services, which only creates tables on first run. It cannot add columns, rename fields, or alter schemas without dropping and recreating the database — destroying all production data. This is the single biggest operational risk before going live.

#### Commands

```bash
# Generate a migration for a specific service
cc migrate add <service> <migration-name>
cc migrate add catalog AddProductWeight

# Apply pending migrations to a target environment
cc migrate apply <service> [--env development|staging|production]
cc migrate apply catalog --env production

# Show migration status across all services
cc migrate status
cc migrate status --env production

# Generate a SQL script instead of applying directly (for DBA review)
cc migrate script <service> --from <migration> --to <migration>
cc migrate script catalog --from Initial --to AddProductWeight

# Rollback the last migration (with safety confirmation)
cc migrate rollback <service> --env production --confirm

# Validate that a migration won't cause data loss
cc migrate validate <service>
```

#### How It Works

1. **Wraps EF Core Migrations** — Generates `dotnet ef migrations add` and `dotnet ef database update` commands targeting the correct Infrastructure project and startup project for each service.
2. **Service Registry** — Maintains a map of all 11 services to their Infrastructure .csproj, Api .csproj, and DbContext class names. No need to remember paths.
3. **Data Loss Detection** — Before applying, runs `dotnet ef migrations script` and parses the SQL for destructive operations (`DROP TABLE`, `DROP COLUMN`, `ALTER COLUMN` that changes type). Warns and requires `--force` flag to proceed.
4. **Migration History** — Stores a local manifest (`migrations.json`) tracking which migrations have been applied to which environments, who applied them, and when.
5. **Pre/Post Scripts** — Supports custom SQL scripts that run before or after a migration (e.g., backfill data into a new column before setting it to NOT NULL).

#### Service Registry (built-in)

| Service | Infrastructure Project | DbContext |
|---------|----------------------|-----------|
| catalog | `CrownCommerce.Catalog.Infrastructure` | `CatalogDbContext` |
| chat | `CrownCommerce.Chat.Infrastructure` | `ChatDbContext` |
| content | `CrownCommerce.Content.Infrastructure` | `ContentDbContext` |
| crm | `CrownCommerce.Crm.Infrastructure` | `CrmDbContext` |
| identity | `CrownCommerce.Identity.Infrastructure` | `IdentityDbContext` |
| inquiry | `CrownCommerce.Inquiry.Infrastructure` | `InquiryDbContext` |
| newsletter | `CrownCommerce.Newsletter.Infrastructure` | `NewsletterDbContext` |
| notification | `CrownCommerce.Notification.Infrastructure` | `NotificationDbContext` |
| order | `CrownCommerce.Order.Infrastructure` | `OrderDbContext` |
| payment | `CrownCommerce.Payment.Infrastructure` | `PaymentDbContext` |
| scheduling | `CrownCommerce.Scheduling.Infrastructure` | `SchedulingDbContext` |

#### Example Workflow

```bash
# 1. Add a "Weight" column to HairProduct
#    (edit the entity class first)
cc migrate add catalog AddProductWeight

# 2. Check what SQL will run
cc migrate script catalog

# 3. Validate no data loss
cc migrate validate catalog

# 4. Apply to local dev
cc migrate apply catalog

# 5. Apply to production (requires confirmation)
cc migrate apply catalog --env production
```

---

### 2. `cc deploy` — Azure Deployment Orchestrator

**Priority**: CRITICAL
**Why it matters**: Deploying 11 microservices, an API gateway, 3+ frontends, and supporting infrastructure (SQL databases, RabbitMQ, DNS) to Azure involves dozens of manual steps across multiple tools (`az`, `azd`, `gh`, `npm`). One missed step can leave the system in a broken state. This tool codifies the entire deployment pipeline.

#### Commands

```bash
# Deploy everything (all services + frontends + infra)
cc deploy all --env staging

# Deploy a single backend service
cc deploy service <name> --env production
cc deploy service catalog --env production

# Deploy a frontend application
cc deploy frontend <name> --env production
cc deploy frontend origin-hair-collective --env production
cc deploy frontend mane-haus --env production

# Deploy only infrastructure (databases, messaging, DNS)
cc deploy infra --env staging

# Show deployment status across all resources
cc deploy status --env production

# Rollback a service to its previous version
cc deploy rollback <service> --env production

# Preview what would be deployed (dry run)
cc deploy all --env staging --dry-run
```

#### How It Works

1. **Environment Profiles** — Reads from `cc-config.json` at the repo root, which maps environments to Azure resource groups, subscription IDs, Container App environments, and SQL server names.
2. **Service Deployment** — For each backend service: builds the Docker image, pushes to Azure Container Registry, updates the Container App revision, runs pending database migrations, and verifies health checks.
3. **Frontend Deployment** — For each Angular app: runs `ng build --configuration production`, deploys to Azure Static Web Apps using the deployment token, and purges the CDN cache.
4. **Infrastructure Provisioning** — Creates/updates Azure SQL databases (one per service), RabbitMQ (via Container App), and configures networking.
5. **Health Verification** — After deployment, hits each service's health endpoint and reports status. Automatically rolls back if health checks fail within 60 seconds.
6. **Deployment Manifest** — Writes a deployment record with commit SHA, timestamp, deployer, and service versions to a shared `deployments.json` for audit trail.

#### Configuration (`cc-config.json`)

```json
{
  "environments": {
    "staging": {
      "subscription": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "resourceGroup": "crowncommerce-staging",
      "sqlServer": "crowncommerce-staging.database.windows.net",
      "containerRegistry": "crowncommercestaging.azurecr.io",
      "containerAppEnv": "crowncommerce-staging-env"
    },
    "production": {
      "subscription": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "resourceGroup": "crowncommerce-prod",
      "sqlServer": "crowncommerce.database.windows.net",
      "containerRegistry": "crowncommerceprod.azurecr.io",
      "containerAppEnv": "crowncommerce-prod-env"
    }
  },
  "frontends": {
    "origin-hair-collective": { "domain": "originhair.com" },
    "mane-haus": { "domain": "manehaus.com" },
    "crown-commerce-admin": { "domain": "admin.originhair.com" }
  }
}
```

---

### 3. `cc db` — Database Operations

**Priority**: HIGH
**Why it matters**: Developers need to inspect, clone, and compare databases across environments without writing raw SQL or remembering connection strings. When a production issue occurs, the first step is always "let me see the production data" — and that needs to be safe and fast.

#### Commands

```bash
# Pull a production database to local (schema + data, anonymized)
cc db pull <service> --env production
cc db pull catalog --env production

# Pull schema only (no data)
cc db pull <service> --env production --schema-only

# Compare schemas between environments
cc db diff <service> --from development --to production

# Export a service database to a .bacpac or SQL script
cc db export <service> --env production --format bacpac
cc db export <service> --env production --format sql

# Import a database backup into local
cc db import <service> --file catalog-backup.bacpac

# Reset a local database (drop + recreate + seed)
cc db reset <service>
cc db reset all

# Show connection string for a service/environment
cc db connection <service> --env production

# Open an interactive SQL prompt
cc db query <service> --env development
```

#### How It Works

1. **Connection String Resolver** — Reads connection strings from `appsettings.json`, `appsettings.Production.json`, Azure Key Vault, or environment variables depending on target environment.
2. **Anonymization** — When pulling production data, automatically hashes emails, names, and phone numbers. Configured per-service via an `anonymize.json` manifest that maps table/column pairs to anonymization strategies (hash, fake, mask, null).
3. **Schema Diff** — Uses EF Core's model snapshot comparison to generate a human-readable diff showing added/removed/changed tables, columns, indexes, and constraints.
4. **LocalDB Integration** — All local operations target `(localdb)\MSSQLLocalDB` by default, matching the development setup.

#### Anonymization Config (`anonymize.json`)

```json
{
  "catalog": {},
  "identity": {
    "AppUsers": {
      "Email": "hash",
      "FirstName": "fake:firstName",
      "LastName": "fake:lastName",
      "PasswordHash": "null",
      "Phone": "mask:***-***-####"
    }
  },
  "crm": {
    "Contacts": {
      "Email": "hash",
      "FirstName": "fake:firstName",
      "LastName": "fake:lastName",
      "Phone": "mask"
    }
  }
}
```

---

### 4. `cc seed` — Intelligent Seeder

**Priority**: HIGH
**Why it matters**: The 5 existing seeders only run on empty databases and are hard-coded in each service's `Program.cs`. Developers can't re-seed a single service, add test scenarios, or reset data without dropping the whole database. When frontends evolve, seed data needs to evolve in lockstep.

#### Commands

```bash
# Seed all services
cc seed all

# Seed a specific service
cc seed catalog
cc seed content
cc seed scheduling

# Seed with a specific profile (different data sets)
cc seed all --profile demo
cc seed all --profile minimal
cc seed all --profile load-test

# Reset and re-seed (drops existing data first)
cc seed catalog --reset

# Seed a specific entity only
cc seed catalog --entity products
cc seed content --entity gallery-images

# Show what would be seeded (dry run)
cc seed all --dry-run

# Export current seed data as JSON (to share with team)
cc seed export catalog > catalog-seed.json
cc seed import catalog < catalog-seed.json
```

#### Seed Profiles

| Profile | Purpose | Data Volume |
|---------|---------|-------------|
| `minimal` | Fast startup, just enough to render UI | 3 products, 1 testimonial, 2 FAQs |
| `demo` (default) | Full demo experience | 12 products, 3 testimonials, 8 gallery, 6 FAQs |
| `load-test` | Performance testing | 1000 products, 500 customers, 10000 orders |
| `e2e` | End-to-end test fixtures | Predictable IDs, known test accounts |

---

### 5. `cc cron` — Local Job Scheduler

**Priority**: HIGH
**Why it matters**: The platform needs recurring background work — clearing expired carts, sending reminder emails, generating reports, syncing CRM data — but has no job infrastructure. In production this will be Azure Functions or Hangfire, but locally developers need a way to run and test these jobs without deploying.

#### Commands

```bash
# List all registered jobs
cc cron list

# Run a specific job immediately
cc cron run <job-name>
cc cron run send-follow-up-reminders
cc cron run clear-expired-carts
cc cron run daily-subscriber-digest

# Start the cron daemon (runs all jobs on schedule)
cc cron start
cc cron start --job send-follow-up-reminders  # only run one job

# Show job execution history
cc cron history
cc cron history send-follow-up-reminders

# Register a new job
cc cron add <job-name> --schedule "0 9 * * *" --service crm --handler FollowUpReminderJob
```

#### Built-in Jobs

| Job | Schedule | Service | Description |
|-----|----------|---------|-------------|
| `clear-expired-carts` | Every 30 min | Order | Remove cart items older than 24 hours |
| `send-follow-up-reminders` | Daily 9am | CRM | Email contacts with overdue follow-ups |
| `send-meeting-reminders` | Every 15 min | Scheduling | Notify attendees 15 min before meetings |
| `daily-subscriber-digest` | Daily 8am | Newsletter | Send daily digest to subscribers |
| `weekly-campaign-report` | Monday 9am | Newsletter | Generate campaign performance report |
| `sync-employee-presence` | Every 5 min | Scheduling | Update employee presence based on last activity |
| `cleanup-notification-logs` | Daily 2am | Notification | Archive logs older than 90 days |
| `refresh-crm-metrics` | Every hour | CRM | Recalculate lead scores and pipeline metrics |
| `generate-revenue-report` | Daily 6am | Order + Payment | Daily revenue and order summary |
| `check-payment-status` | Every 10 min | Payment | Poll pending payments and update status |

#### How It Works

1. **Lightweight Scheduler** — Uses `System.Threading.Timer` with NCrontab for cron expression parsing. No external dependencies.
2. **Service Integration** — Each job class receives a scoped `IServiceProvider` with access to the target service's DbContext and application services via direct project references.
3. **Execution Logging** — Every run is logged to a local SQLite database (`~/.crowncommerce/cron-history.db`) with start time, duration, status, and error details.
4. **Concurrent Safety** — Jobs acquire a named mutex to prevent overlapping runs. Configurable timeout per job.
5. **Production Parity** — Job classes are designed to be reusable. The same `IJob` implementations can be registered in Azure Functions or Hangfire with zero code changes.

---

### 6. `cc email` — Email Campaign & Transactional Mailer

**Priority**: HIGH
**Why it matters**: The Newsletter service has SMTP infrastructure and the Notification service uses SendGrid, but there's no way to test email flows locally, preview templates, or send one-off campaigns without writing code. This tool bridges the gap between development and marketing operations.

#### Commands

```bash
# Send a test email (uses local SMTP or SendGrid depending on config)
cc email send --to quinn@crowncommerce.com --template order-confirmation --data '{"orderId": "123"}'

# Preview an email template in the browser
cc email preview order-confirmation
cc email preview newsletter-welcome

# List all available email templates
cc email templates

# Send a campaign to subscribers matching a tag
cc email campaign --subject "Spring Collection Launch" --template spring-launch --tag origin-coming-soon
cc email campaign --subject "New Arrivals" --template new-arrivals --tag mane-haus-coming-soon

# Show email sending history
cc email history
cc email history --to quinn@crowncommerce.com

# Start a local SMTP server for testing (catches all emails)
cc email server
cc email server --port 1025 --ui-port 8025

# Validate email configuration
cc email test-config --env production
```

#### How It Works

1. **Template Engine** — Loads email templates from the Notification service's `EmailTemplates.cs` and the Newsletter service's campaign system. Renders them with sample data for preview.
2. **Local SMTP Trap** — Bundles a lightweight SMTP server (like MailHog) that catches all outgoing emails during development. Opens a web UI to inspect rendered emails.
3. **SendGrid / SMTP Switching** — Reads email configuration from the service configs. In development, routes to the local SMTP trap. In production, uses SendGrid or configured SMTP.
4. **Campaign Execution** — Queries the Newsletter database for subscribers matching the target tag, batches them into groups of 100, and sends via the configured provider with rate limiting.
5. **Unsubscribe Handling** — Automatically includes unsubscribe links using subscriber tokens from the Newsletter database.

---

### 7. `cc team` — Team Member Management

**Priority**: MEDIUM
**Why it matters**: Managing employees spans two services (Identity for user accounts, Scheduling for employee profiles). Creating a team member currently requires manual API calls to both services with synchronized GUIDs. This tool provides a single interface for team management across both databases.

#### Commands

```bash
# List all team members
cc team list
cc team list --department "Hair Stylists"
cc team list --status active

# Add a new team member (creates in both Identity + Scheduling)
cc team add --email amina@crowncommerce.com --first-name Amina --last-name Osei \
  --role Admin --job-title "Senior Stylist" --department "Hair Stylists" --timezone "America/Toronto"

# Update a team member
cc team update quinn@crowncommerce.com --job-title "CTO" --department "Engineering"

# Deactivate a team member (soft delete across both services)
cc team deactivate quinn@crowncommerce.com

# Reactivate a team member
cc team activate quinn@crowncommerce.com

# Reset a team member's password
cc team reset-password quinn@crowncommerce.com

# Show a team member's full profile (merged from both services)
cc team show quinn@crowncommerce.com

# Export team directory
cc team export --format csv > team-directory.csv
cc team export --format json > team-directory.json

# Import team members from CSV (bulk onboarding)
cc team import --file new-hires.csv
```

#### How It Works

1. **Dual-Service Coordination** — Creates an `AppUser` in the Identity database and a corresponding `Employee` in the Scheduling database with the same `UserId`, within a distributed transaction using the Saga pattern.
2. **Password Hashing** — Uses the same BCrypt hashing as the Identity service to ensure compatibility.
3. **Timezone Awareness** — Stores IANA timezone identifiers (e.g., `America/Toronto`, `Africa/Lagos`) and displays local times in output.
4. **Role Mapping** — Maps Identity roles (`Admin`, `Customer`) to Scheduling-specific fields (`JobTitle`, `Department`).

---

### 8. `cc schedule` — Meeting & Schedule Manager

**Priority**: MEDIUM
**Why it matters**: The Teams app is 50% built and has no way to create meetings or channels from the command line. For a distributed team across multiple timezones (Toronto, Lagos, London), quickly scheduling meetings with timezone conversion is a daily need.

#### Commands

```bash
# List upcoming meetings
cc schedule meetings
cc schedule meetings --week
cc schedule meetings --for quinn@crowncommerce.com

# Create a meeting (times in your local timezone, stored as UTC)
cc schedule create-meeting --title "Sprint Planning" \
  --start "2026-02-16 10:00" --end "2026-02-16 11:00" \
  --attendees quinn@crowncommerce.com,amara@crowncommerce.com \
  --location "Google Meet"

# Show a meeting with all attendee timezones
cc schedule show-meeting <meeting-id>

# RSVP to a meeting
cc schedule rsvp <meeting-id> --accept
cc schedule rsvp <meeting-id> --decline

# Create a recurring meeting
cc schedule create-meeting --title "Daily Standup" \
  --start "2026-02-16 09:00" --duration 15m \
  --recurrence "weekdays" --attendees all

# List channels
cc schedule channels
cc schedule channels --type public

# Create a channel
cc schedule create-channel --name "product-launches" --type public

# Show team availability (timezone-aware grid)
cc schedule availability --date 2026-02-17
```

#### Timezone Display Example

```
$ cc schedule show-meeting abc123

Sprint Planning
  When: Monday Feb 16, 2026
  ─────────────────────────────
  Toronto (Quinn, Sophia)    10:00 AM - 11:00 AM EST
  Lagos (Amara, Wanjiku)      3:00 PM -  4:00 PM WAT
  London (James)              3:00 PM -  4:00 PM GMT
  ─────────────────────────────
  Attendees: 5 (3 accepted, 1 pending, 1 declined)
```

---

### 9. `cc env` — Environment & Health Manager

**Priority**: MEDIUM
**Why it matters**: With 11 services, RabbitMQ, SQL Server, and multiple frontends, it's hard to know if everything is running correctly. Developers waste time debugging connectivity issues that a simple health check would catch.

#### Commands

```bash
# Check health of all services (local or remote)
cc env health
cc env health --env production

# Show status of all local databases
cc env databases

# Start the full local environment (Aspire AppHost)
cc env up

# Stop all running services
cc env down

# Show environment configuration
cc env config --env production

# Validate all connection strings and credentials
cc env validate --env staging

# Show port mappings for all services
cc env ports

# Check RabbitMQ queue status
cc env queues
```

#### Health Check Output

```
$ cc env health

Crown Commerce Health Check — Development
═══════════════════════════════════════════

  Backend Services
  ────────────────
  catalog-api        :5100  [OK]  12 products, 5 origins
  content-api        :5050  [OK]  5 pages, 8 gallery images
  identity-api       :5070  [OK]  5 users
  inquiry-api        :5200  [OK]  0 inquiries
  newsletter-api     :5800  [OK]  0 subscribers
  notification-api   :5060  [OK]  SendGrid configured
  order-api          :5030  [OK]  0 orders
  payment-api        :5041  [OK]  0 payments
  chat-api           :5095  [OK]  0 conversations
  crm-api            :5090  [OK]  0 contacts
  scheduling-api     :5280  [OK]  5 employees, 4 meetings

  Infrastructure
  ──────────────
  SQL Server (LocalDB)       [OK]  11 databases
  RabbitMQ                   [OK]  9 queues bound
  API Gateway         :5000  [OK]  12 routes configured

  Frontend Applications
  ─────────────────────
  origin-hair-collective     :4200  [OK]
  crown-commerce-admin       :4206  [OK]
  mane-haus                  :4203  [OK]
  teams                      :4205  [WARN]  TS2307: Cannot find module 'api'

  Summary: 17/18 healthy, 1 warning
```

---

### 10. `cc sync` — Timezone-Aware Collaboration

**Priority**: MEDIUM
**Why it matters**: Crown Commerce operates across Toronto, Lagos, and London. Coordinating async handoffs, knowing who's online, and leaving context for the next person's workday are daily challenges. This tool bridges timezone gaps.

#### Commands

```bash
# Show team's current local times and working status
cc sync now

# Leave a handoff note for a teammate (delivered when they start their day)
cc sync handoff --to amara@crowncommerce.com --message "Deployed catalog update, needs QA on product images"

# Show pending handoff notes for you
cc sync inbox

# Find overlapping working hours between team members
cc sync overlap quinn amara james

# Set your working hours
cc sync hours --start 9:00 --end 17:00 --timezone America/Toronto

# Show who's available right now
cc sync available

# Start a focus session (updates your presence)
cc sync focus --duration 2h --message "Working on payment integration"
```

#### Output Example

```
$ cc sync now

Team Status — Sat Feb 15, 2026
═══════════════════════════════

  Toronto (EST, UTC-5)           8:04 AM
  ├── Quinn M.        [ONLINE]   Senior Developer
  └── Sophia L.       [OFFLINE]  starts at 9:00 AM (56 min)

  Lagos (WAT, UTC+1)             2:04 PM
  ├── Amara K.        [ONLINE]   Lead Developer
  └── Wanjiku N.      [FOCUS]    "Reviewing CRM module" (until 3:00 PM)

  London (GMT, UTC+0)            1:04 PM
  └── James R.        [ONLINE]   Backend Developer

  Overlap windows today:
  ├── All team:   9:00 AM - 12:00 PM EST  (3 hours)
  └── Quinn+Amara: 9:00 AM - 5:00 PM EST  (8 hours)
```

---

### 11. `cc logs` — Centralized Log Viewer

**Priority**: MEDIUM
**Why it matters**: With 11 services running simultaneously, finding the relevant log output for a specific request means sifting through multiple terminal windows or the Aspire dashboard. This tool aggregates and filters logs across all services.

#### Commands

```bash
# Tail logs from all services
cc logs

# Tail logs from specific services
cc logs --service catalog --service order

# Filter by log level
cc logs --level error
cc logs --level warning --service payment

# Search logs for a specific term
cc logs --search "PaymentFailed"

# Show logs for a specific request/correlation ID
cc logs --correlation abc-123-def

# Export logs to a file
cc logs --service catalog --since "1 hour ago" --output catalog-logs.txt
```

---

### 12. `cc gen` — Code Scaffolder

**Priority**: LOW
**Why it matters**: Adding a new entity to any of the 11 services requires touching 5-8 files (entity, DbContext, controller, DTOs, seeder, consumer). Scaffolding this boilerplate saves time and ensures consistency.

#### Commands

```bash
# Scaffold a new entity with full CRUD
cc gen entity <service> <entity-name>
cc gen entity catalog HairBundle

# Scaffold a new MassTransit consumer
cc gen consumer <service> <event-name>
cc gen consumer notification OrderShippedNotification

# Scaffold a new service from scratch
cc gen service <service-name>

# Scaffold a new Angular page in an app
cc gen page <app> <page-name>
cc gen page crown-commerce-admin bundles-list
```

#### What `cc gen entity catalog HairBundle` Creates

```
Modified:
  src/Services/Catalog/CrownCommerce.Catalog.Core/Entities/HairBundle.cs
  src/Services/Catalog/CrownCommerce.Catalog.Infrastructure/Data/CatalogDbContext.cs  (adds DbSet)
  src/Services/Catalog/CrownCommerce.Catalog.Api/Controllers/HairBundlesController.cs (full CRUD)
  src/Services/Catalog/CrownCommerce.Catalog.Api/DTOs/HairBundleDtos.cs
```

---

## Implementation Roadmap

### Phase 1 — Foundation (Week 1-2)
Build the `cc` CLI shell with `System.CommandLine`, service registry, configuration loading, and database connection resolution. Implement `cc env` and `cc seed` as the simplest tools to validate the architecture.

### Phase 2 — Database Safety (Week 3-4)
Implement `cc migrate` and `cc db`. This is the highest-value work — migrating from `EnsureCreatedAsync()` to proper EF Core Migrations across all 11 services, with data loss protection.

### Phase 3 — Deployment (Week 5-6)
Implement `cc deploy` with Azure Container Apps integration. Start with single-service deployment and build up to full orchestration.

### Phase 4 — Operations (Week 7-8)
Implement `cc team`, `cc schedule`, `cc cron`, and `cc email`. These build on the database tools and add the day-to-day operational capabilities.

### Phase 5 — Collaboration (Week 9-10)
Implement `cc sync` and `cc logs`. These are the quality-of-life tools that make distributed teamwork smoother.

---

## Project Structure

```
src/
  Tools/
    CrownCommerce.Cli/
      CrownCommerce.Cli.csproj          # dotnet tool, OutputType: Exe
      Program.cs                         # System.CommandLine root command
      Commands/
        MigrateCommand.cs
        DeployCommand.cs
        DbCommand.cs
        SeedCommand.cs
        CronCommand.cs
        EmailCommand.cs
        TeamCommand.cs
        ScheduleCommand.cs
        EnvCommand.cs
        SyncCommand.cs
        LogsCommand.cs
        GenCommand.cs
      Infrastructure/
        ServiceRegistry.cs               # Maps service names to projects/contexts
        ConnectionStringResolver.cs      # Resolves conn strings per environment
        AzureCredentialProvider.cs        # Azure auth via DefaultAzureCredential
      Jobs/                              # Cron job implementations
        ClearExpiredCartsJob.cs
        SendFollowUpRemindersJob.cs
        SendMeetingRemindersJob.cs
        ...
```

## Installation

```bash
# Install as a dotnet global tool
dotnet tool install --global CrownCommerce.Cli

# Or run from source
dotnet run --project src/Tools/CrownCommerce.Cli -- migrate status
```

---

*See individual tool deep-dives in the [`docs/cli/`](./cli/) folder.*
