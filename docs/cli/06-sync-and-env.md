# cc sync & cc env — Collaboration and Environment Tools

> **Rank**: #9 (env), #10 (sync)
> **Effort**: Low-Medium
> **Dependencies**: Scheduling database, Aspire AppHost

## cc env — Environment & Health Manager

### The Problem

"Is everything running?" is a question asked 10+ times a day. With 11 services, an API gateway, RabbitMQ, SQL Server, and multiple frontends, the answer is never obvious. Developers waste 5-10 minutes each session checking ports, verifying databases exist, and restarting crashed services.

### Quick Health Check

```bash
$ cc env health

Crown Commerce Health — Development
═════════════════════════════════════

  Backend (11 services)
  ─────────────────────
  catalog-api        :5100  ✓  12 products
  content-api        :5050  ✓  5 pages, 8 gallery
  identity-api       :5070  ✓  5 users
  inquiry-api        :5200  ✓  ready
  newsletter-api     :5800  ✓  ready
  notification-api   :5060  ✓  SendGrid configured
  order-api          :5030  ✓  ready
  payment-api        :5041  ✓  ready
  chat-api           :5095  ✓  ready
  crm-api            :5090  ✓  ready
  scheduling-api     :5280  ✓  5 employees, 4 meetings

  Infrastructure
  ──────────────
  SQL Server         LocalDB  ✓  11 databases
  RabbitMQ           :5672   ✓  9 queues
  API Gateway        :5000   ✓  12 routes

  Frontend (6 apps)
  ─────────────────
  origin-hair-collective     :4201  ✓
  origin-coming-soon         :4202  ✓
  mane-haus                  :4203  ✓
  mane-haus-coming-soon      :4204  ✓
  teams                      :4205  ✓
  admin                      :4206  ✓

  18/18 healthy
```

### Environment Startup

Replace the multi-step Aspire + manual frontend startup:

```bash
# Start everything with one command
$ cc env up
Starting Crown Commerce development environment...
  [1/4] SQL Server LocalDB           started
  [2/4] Aspire AppHost               started (11 services + gateway + RabbitMQ)
  [3/4] Building shared libraries    components ✓  api ✓  features ✓
  [4/4] Frontend applications        4201 ✓  4202 ✓  4203 ✓  4204 ✓  4205 ✓  4206 ✓

All 18 resources running. Dashboard: http://localhost:15888

# Start only what you need
$ cc env up --services catalog,content --frontends origin-hair-collective

# Shut down everything
$ cc env down
Stopping all Crown Commerce processes...
  Stopped 6 frontend dev servers
  Stopped Aspire AppHost (11 services + gateway + RabbitMQ)
  All processes stopped.
```

### Port Map

```bash
$ cc env ports

Crown Commerce Port Assignments
═══════════════════════════════

  Service               Port    Protocol   Notes
  ──────────────────────────────────────────────────
  catalog-api           5100    HTTP       12 products, 5 origins
  content-api           5050    HTTP       CMS content
  identity-api          5070    HTTP       Auth + JWT
  inquiry-api           5200    HTTP       Contact forms
  newsletter-api        5800    HTTP       Subscriber management
  notification-api      5060    HTTP       Email dispatch
  order-api             5030    HTTP       Orders + cart
  payment-api           5041    HTTP       Payment processing
  chat-api              5095    HTTP       Customer chat
  crm-api               5090    HTTP       CRM + contacts
  scheduling-api        5280    HTTP       Team scheduling
  api-gateway           5000    HTTP       YARP reverse proxy
  rabbitmq              5672    AMQP       Message broker
  rabbitmq-mgmt        15672    HTTP       Management UI
  aspire-dashboard     15888    HTTP       Aspire dashboard
  origin-hair           4201    HTTP       Main storefront (via Aspire)
  origin-coming-soon    4202    HTTP       Coming soon page
  mane-haus             4203    HTTP       Mane Haus storefront
  mane-haus-coming      4204    HTTP       Mane Haus coming soon
  teams                 4205    HTTP       Team management app
  admin                 4206    HTTP       Admin dashboard
```

### Database Overview

```bash
$ cc env databases

Local Databases — (localdb)\MSSQLLocalDB
════════════════════════════════════════════

  Database                    Tables   Rows     Size     Last Modified
  ─────────────────────────────────────────────────────────────────────
  CrownCommerce_Catalog       2        17       256 KB   Feb 15, 08:00
  CrownCommerce_Chat          3        0        128 KB   Feb 15, 08:00
  CrownCommerce_Content       4        22       384 KB   Feb 15, 08:00
  CrownCommerce_Crm           5        0        256 KB   Feb 15, 08:00
  CrownCommerce_Identity      1        5        128 KB   Feb 15, 08:00
  CrownCommerce_Inquiry       1        0        128 KB   Feb 15, 08:00
  CrownCommerce_Newsletter    4        0        256 KB   Feb 15, 08:00
  CrownCommerce_Notification  1        0        128 KB   Feb 15, 08:00
  CrownCommerce_Order         3        0        256 KB   Feb 15, 08:00
  CrownCommerce_Payment       2        0        128 KB   Feb 15, 08:00
  CrownCommerce_Scheduling    10       33       512 KB   Feb 15, 08:00
  ─────────────────────────────────────────────────────────────────────
  Total: 11 databases, 36 tables, 77 rows, 2.4 MB
```

---

## cc sync — Timezone-Aware Collaboration

### The Problem

Crown Commerce's team spans three continents:

- **Toronto** (EST, UTC-5): Quinn, Sophia
- **Lagos** (WAT, UTC+1): Amara, Wanjiku
- **London** (GMT, UTC+0): James

The 6-hour gap between Toronto and Lagos means work often happens asynchronously. When Amara finishes a feature at 5 PM WAT (11 AM EST), Quinn might not see it until hours later. There's no structured way to hand off context between shifts.

### Handoff Notes

Leave context for teammates who'll pick up work in their timezone:

```bash
$ cc sync handoff \
    --to quinn \
    --message "Deployed the new product filtering to staging. The texture filter
    works but the price range slider has a bug on mobile — the max value resets
    on touch release. I've left a TODO in catalog-filter.ts:142. Screenshots
    in the #engineering channel."

Handoff note saved.
Quinn will see this when they come online (estimated: 9:00 AM EST, in 4 hours)
```

When Quinn starts their day:

```
$ cc sync inbox

Good morning, Quinn! You have 2 handoff notes.
═══════════════════════════════════════════════

  From: Amara K. (Lagos, 5:00 PM WAT → your 11:00 AM EST)
  ──────────────────────────────────────────────────────────
  Deployed the new product filtering to staging. The texture filter
  works but the price range slider has a bug on mobile — the max value
  resets on touch release. I've left a TODO in catalog-filter.ts:142.
  Screenshots in the #engineering channel.

  From: James R. (London, 4:30 PM GMT → your 11:30 AM EST)
  ─────────────────────────────────────────────────────────────
  Payment provider webhook tests are passing on staging. Ready for
  your review: PR #47. The Stripe test keys expire March 1 — added
  a reminder in the calendar.
```

### Overlap Finder

Plan synchronous collaboration during shared hours:

```bash
$ cc sync overlap quinn amara james

Overlapping Working Hours
═════════════════════════

  Quinn (EST)     ████████████████████████████████░░░░░░░░░░░░░░░░
  Amara (WAT)     ░░░░░░░░░░░░████████████████████████████████░░░░
  James (GMT)     ░░░░░░░░████████████████████████████████░░░░░░░░

                  05  06  07  08  09  10  11  12  13  14  15  16  17  18  EST

  All three overlap:  10:00 AM - 12:00 PM EST  (2 hours)
                    =  3:00 PM -  5:00 PM WAT
                    =  3:00 PM -  5:00 PM GMT

  Quinn + Amara:      9:00 AM -  5:00 PM EST  (8 hours)
  Quinn + James:      9:00 AM -  1:00 PM EST  (4 hours)
  Amara + James:      8:00 AM -  5:00 PM WAT  (9 hours)
```

### Focus Mode

Communicate deep work sessions to the team:

```bash
$ cc sync focus --duration 2h --message "Working on payment webhook integration"
Focus session started (until 10:04 AM EST)
  Your presence updated to 'Focus' in Scheduling database
  Team members will see: "Quinn is in focus mode: Working on payment webhook integration"

$ cc sync available
  Quinn M.     [FOCUS]   Working on payment webhook integration (until 10:04 AM)
  Amara K.     [ONLINE]  Last active 2 min ago
  James R.     [ONLINE]  Last active 8 min ago
  Wanjiku N.   [AWAY]    Last seen 45 min ago
  Sophia L.    [OFFLINE] Starts at 9:00 AM EST (56 min)
```

### How Handoff Notes Are Stored

Stored in the Scheduling database as a new `HandoffNote` entity:

```csharp
public class HandoffNote
{
    public Guid Id { get; set; }
    public Guid FromEmployeeId { get; set; }
    public Guid ToEmployeeId { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAtUtc { get; set; }
}
```

This integrates with the existing Scheduling service — the Teams app can display handoff notes in the Activity Feed once the frontend catches up.
