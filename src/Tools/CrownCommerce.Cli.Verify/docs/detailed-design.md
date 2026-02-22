# CrownCommerce.Cli.Verify -- Detailed Design

## Purpose

CrownCommerce.Cli.Verify is a deployment verification CLI tool for querying coming-soon subscribers from the Newsletter database. After deploying the coming-soon sites (Origin Hair Collective and Mane Haus), operators use this tool to verify that subscriber sign-ups are being captured correctly in the SQL Server Newsletter database.

The tool connects directly to the `NewsletterDb` via EF Core and provides a tabular view of subscribers who signed up through coming-soon landing pages.

## Architecture

```
Program.cs (Host + DI)
    |
    v
VerifyCommand (System.CommandLine)
    |
    v
ISubscriberQueryService / SubscriberQueryService
    |
    v
NewsletterDbContext (EF Core)
    |
    v
SQL Server (NewsletterDb)
```

### Layers

| Layer | Responsibility |
|---|---|
| `Program.cs` | Bootstraps `Host.CreateApplicationBuilder`, registers `NewsletterDbContext` and `SubscriberQueryService`, creates the root command, and invokes it. |
| `Commands/VerifyCommand.cs` | Defines the `System.CommandLine` root command and the `list-subscribers` subcommand. Resolves scoped services and formats console output. |
| `Services/ISubscriberQueryService.cs` | Defines the service contract and the `ComingSoonSubscriber` data record. |
| `Services/SubscriberQueryService.cs` | Implements the EF Core query logic against `NewsletterDbContext`. |

### Dependencies

The CLI project references `CrownCommerce.Newsletter.Infrastructure` to gain access to:

- `NewsletterDbContext` -- the EF Core DbContext
- `Subscriber` and `SubscriberTag` entities from `CrownCommerce.Newsletter.Core`
- `SubscriberStatus` enum from `CrownCommerce.Newsletter.Core`

NuGet packages:

- `System.CommandLine` -- CLI argument parsing
- `Microsoft.Extensions.Hosting` -- generic host, DI, configuration, logging
- `Microsoft.EntityFrameworkCore.SqlServer` -- (transitive via Infrastructure) SQL Server provider

## Commands

### `list-subscribers`

Lists all subscribers who signed up via coming-soon sites.

```
crowncommerce-cli-verify list-subscribers [--tag <tag>]
```

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `--tag` | `string?` | No | Filter by a specific tag. Example values: `origin-hair-collective-coming-soon`, `mane-haus-coming-soon`. |

**Behavior:**

1. Queries all subscribers that have at least one tag containing the substring `"coming-soon"`.
2. If `--tag` is provided, further filters to only subscribers that have that exact tag.
3. Results are ordered by `CreatedAt` descending (newest first).
4. Output is formatted as a fixed-width table with columns: Email, Name, Status, Signed Up, Tags.
5. A total count is printed at the end.
6. If no subscribers match, prints `"No coming-soon subscribers found."`.

**Example output:**

```
Email                                    Name                           Status          Signed Up              Tags
----------------------------------------------------------------------------------------------------------------------------------
carol@example.com                        Carol Smith                    Active          2025-12-10 09:15:00   origin-hair-collective-coming-soon, mane-haus-coming-soon
bob@example.com                          Bob                            Pending         2025-12-05 14:30:00   mane-haus-coming-soon
alice@example.com                        Alice Johnson                  Active          2025-12-01 10:00:00   origin-hair-collective-coming-soon

Total: 3 subscriber(s)
```

## Data Model

### ComingSoonSubscriber (projection record)

Defined in `Services/ISubscriberQueryService.cs`:

```csharp
public record ComingSoonSubscriber(
    Guid Id,
    string Email,
    string? FirstName,
    string? LastName,
    string Status,
    DateTime CreatedAt,
    List<string> Tags);
```

This is a read-only projection record, not an EF Core entity. It is materialized from the LINQ query via `Select()`.

### Source Entities

The query reads from the following Newsletter domain entities:

**Subscriber** (`CrownCommerce.Newsletter.Core.Entities.Subscriber`)

| Property | Type | Notes |
|---|---|---|
| `Id` | `Guid` | Primary key |
| `Email` | `string` | Unique, max 300 chars |
| `FirstName` | `string?` | Max 200 chars |
| `LastName` | `string?` | Max 200 chars |
| `UserId` | `Guid?` | Optional link to user account |
| `Status` | `SubscriberStatus` | Enum: `Pending`, `Active`, `Unsubscribed` |
| `ConfirmationToken` | `string?` | Max 100 chars |
| `ConfirmedAt` | `DateTime?` | When double-opt-in was confirmed |
| `CreatedAt` | `DateTime` | Sign-up timestamp |
| `UnsubscribedAt` | `DateTime?` | When unsubscribed |
| `UnsubscribeToken` | `string?` | Max 100 chars, unique (filtered index) |
| `Tags` | `ICollection<SubscriberTag>` | Navigation property, cascade delete |

**SubscriberTag** (`CrownCommerce.Newsletter.Core.Entities.SubscriberTag`)

| Property | Type | Notes |
|---|---|---|
| `Id` | `Guid` | Primary key |
| `SubscriberId` | `Guid` | Foreign key to Subscriber |
| `Tag` | `string` | Max 100 chars; composite unique index on (SubscriberId, Tag) |
| `CreatedAt` | `DateTime` | When the tag was applied |

## Database Integration

### Connection

- **Provider:** SQL Server via `Microsoft.EntityFrameworkCore.SqlServer`
- **Connection string:** Loaded from configuration under `ConnectionStrings:NewsletterDb`
- **User secrets:** The project has a `UserSecretsId` (`32143185-4c76-4d68-b388-d764b16fb6c4`) for local development credentials

### Configuration

`Program.cs` uses `Host.CreateApplicationBuilder(args)` which automatically loads:

1. `appsettings.json`
2. `appsettings.{Environment}.json`
3. User secrets (in Development)
4. Environment variables
5. Command-line arguments

### Query Logic

The `SubscriberQueryService.GetComingSoonSubscribersAsync` method executes the following query:

```csharp
var query = db.Subscribers
    .Include(s => s.Tags)
    .Where(s => s.Tags.Any(t => t.Tag.Contains("coming-soon")));

if (tag is not null)
{
    query = query.Where(s => s.Tags.Any(t => t.Tag == tag));
}

var subscribers = await query
    .OrderByDescending(s => s.CreatedAt)
    .Select(s => new ComingSoonSubscriber(
        s.Id, s.Email, s.FirstName, s.LastName,
        s.Status.ToString(), s.CreatedAt,
        s.Tags.Select(t => t.Tag).ToList()))
    .ToListAsync();
```

Key behaviors:

- **Base filter:** Includes any subscriber with at least one tag containing the substring `"coming-soon"` (uses `String.Contains`).
- **Optional tag filter:** When `--tag` is provided, adds an additional exact-match filter (`Tag == tag`). Both filters must be satisfied -- the subscriber must have a coming-soon tag AND the specified exact tag (which may be the same tag or a different one).
- **Ordering:** Results are sorted by `CreatedAt` descending so the most recent sign-ups appear first.
- **Projection:** The query projects directly into `ComingSoonSubscriber` records, converting `Status` from the enum to a string and flattening tags into a `List<string>`.

## Testing Strategy

### Approach

Integration tests verify the `SubscriberQueryService` against a real `NewsletterDbContext` backed by the EF Core InMemory provider. This validates the full LINQ-to-Objects query path including `Include`, `Where`, `OrderByDescending`, and `Select` projections.

### Test Infrastructure

- **Provider:** `Microsoft.EntityFrameworkCore.InMemory` with a unique database name per test instance (`Guid.NewGuid()`)
- **Lifecycle:** Tests implement `IAsyncLifetime` for setup (`EnsureCreatedAsync` + seed data) and teardown (`EnsureDeletedAsync` + `DisposeAsync`)
- **Logger:** A no-op `ILogger<SubscriberQueryService>` created via `LoggerFactory.Create`

### Seed Data

Each test instance is seeded with four subscribers:

| Email | Tags | Status | CreatedAt |
|---|---|---|---|
| `alice@example.com` | `origin-hair-collective-coming-soon` | Active | 2025-12-01 |
| `bob@example.com` | `mane-haus-coming-soon` | Pending | 2025-12-05 |
| `carol@example.com` | `origin-hair-collective-coming-soon`, `mane-haus-coming-soon` | Active | 2025-12-10 |
| `dave@example.com` | `general-newsletter` | Active | 2025-11-20 |

Dave serves as a control -- he has no coming-soon tags and should never appear in results.

### Test Coverage (4 tests)

| Test | Verifies |
|---|---|
| `GetComingSoonSubscribers_Returns_Only_ComingSoon_Subscribers` | Base filter returns exactly 3 coming-soon subscribers and excludes Dave. Asserts every result has at least one tag containing `"coming-soon"`. |
| `GetComingSoonSubscribers_Filters_By_Tag` | Passing `--tag mane-haus-coming-soon` returns 2 subscribers (Bob and Carol). Asserts each result contains the exact tag. |
| `GetComingSoonSubscribers_Returns_Ordered_By_CreatedAt_Descending` | Results appear in order: Carol (Dec 10), Bob (Dec 5), Alice (Dec 1). |
| `GetComingSoonSubscribers_Returns_Empty_When_No_Matches` | Passing a nonexistent tag returns an empty list. |

## Solution Structure

```
CrownCommerce.Cli.Verify.sln
|
+-- src/
|   +-- CrownCommerce.Cli.Verify/
|       +-- Commands/
|       |   +-- VerifyCommand.cs
|       +-- Services/
|       |   +-- ISubscriberQueryService.cs
|       |   +-- SubscriberQueryService.cs
|       +-- Program.cs
|       +-- CrownCommerce.Cli.Verify.csproj
|
+-- tests/
    +-- CrownCommerce.Cli.Verify.Tests/
        +-- ListSubscribersIntegrationTests.cs
        +-- CrownCommerce.Cli.Verify.Tests.csproj
```

## Target Framework

- .NET 9.0
- C# with nullable reference types enabled and implicit usings
