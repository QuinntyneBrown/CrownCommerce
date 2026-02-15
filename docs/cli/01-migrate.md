# cc migrate — Database Migration Manager

> **Rank**: #1 (Critical)
> **Effort**: Medium (2-3 weeks)
> **Dependencies**: EF Core Tools, SQL Server

## The Problem

Every service uses `EnsureCreatedAsync()` which has a fatal limitation: it only works on empty databases. Once a database has data, the only way to change the schema is to drop and recreate — destroying everything. This is acceptable during early development but blocks any production deployment where data must survive schema changes.

Real scenarios this causes:

- Adding a `Weight` field to `HairProduct` requires dropping the entire Catalog database (all 12 seeded products, plus any manually-added ones)
- Renaming `CustomerOrder.ShippingAddress` to `CustomerOrder.DeliveryAddress` is impossible without data loss
- The CRM's TPH inheritance (Contact → Customer/Lead/HairStylist/HairSalon) cannot evolve once real contacts exist
- No way to add indexes to production databases under load

## The Solution

Replace `EnsureCreatedAsync()` with EF Core Migrations across all 11 services, wrapped in a CLI that handles the complexity of knowing which project to target, which DbContext to use, and whether the migration is safe.

## Technical Design

### Service Registry

The core data structure that makes everything work:

```csharp
public record ServiceInfo(
    string Name,
    string InfrastructureProject,  // relative path to .csproj
    string StartupProject,         // relative path to Api .csproj
    string DbContextClass,
    string DatabaseName,
    int Port
);

public static class ServiceRegistry
{
    public static readonly Dictionary<string, ServiceInfo> Services = new()
    {
        ["catalog"] = new("Catalog",
            "src/Services/Catalog/CrownCommerce.Catalog.Infrastructure/CrownCommerce.Catalog.Infrastructure.csproj",
            "src/Services/Catalog/CrownCommerce.Catalog.Api/CrownCommerce.Catalog.Api.csproj",
            "CatalogDbContext",
            "CrownCommerce_Catalog",
            5100),
        // ... 10 more services
    };
}
```

### Migration Generation

Wraps `dotnet ef migrations add` with the correct project paths:

```csharp
public async Task<int> AddMigration(string serviceName, string migrationName)
{
    var service = ServiceRegistry.Services[serviceName];

    var result = await RunProcess("dotnet", new[]
    {
        "ef", "migrations", "add", migrationName,
        "--project", service.InfrastructureProject,
        "--startup-project", service.StartupProject,
        "--context", service.DbContextClass,
        "--output-dir", "Migrations"
    });

    if (result.ExitCode == 0)
    {
        Console.WriteLine($"Migration '{migrationName}' created for {serviceName}");
        Console.WriteLine($"  File: {service.InfrastructureProject}/Migrations/...");
    }

    return result.ExitCode;
}
```

### Data Loss Detection

Before applying a migration, generate the SQL script and scan for destructive operations:

```csharp
public class MigrationValidator
{
    private static readonly string[] DestructivePatterns =
    {
        "DROP TABLE",
        "DROP COLUMN",
        "ALTER COLUMN",  // type changes can truncate data
        "TRUNCATE",
        "DELETE FROM"
    };

    public ValidationResult Validate(string sqlScript)
    {
        var warnings = new List<string>();

        foreach (var line in sqlScript.Split('\n'))
        {
            foreach (var pattern in DestructivePatterns)
            {
                if (line.Contains(pattern, StringComparison.OrdinalIgnoreCase))
                {
                    warnings.Add($"Potentially destructive: {line.Trim()}");
                }
            }
        }

        return new ValidationResult(
            IsDestructive: warnings.Count > 0,
            Warnings: warnings
        );
    }
}
```

### Migration Status Dashboard

```
$ cc migrate status

Crown Commerce Migration Status — Development
══════════════════════════════════════════════

  Service          Applied    Pending    Last Applied
  ─────────────────────────────────────────────────────
  catalog          3          0          AddProductWeight (Feb 14)
  chat             1          0          Initial (Feb 10)
  content          2          1          AddGalleryCategory (pending)
  crm              1          0          Initial (Feb 10)
  identity         1          0          Initial (Feb 10)
  inquiry          1          0          Initial (Feb 10)
  newsletter       2          0          AddCampaignMetrics (Feb 12)
  notification     1          0          Initial (Feb 10)
  order            1          0          Initial (Feb 10)
  payment          1          0          Initial (Feb 10)
  scheduling       1          0          Initial (Feb 10)
  ─────────────────────────────────────────────────────
  Total:           15         1
```

## Migration from EnsureCreatedAsync

The one-time setup to move each service from `EnsureCreatedAsync()` to Migrations:

### Step 1: Generate Initial Migration (per service)

```bash
cc migrate add catalog Initial
cc migrate add chat Initial
# ... for all 11 services
```

### Step 2: Mark as Applied (databases already exist)

Since the databases were already created by `EnsureCreatedAsync()`, mark the initial migration as applied without running it:

```bash
cc migrate mark-applied catalog Initial
# This inserts a row into __EFMigrationsHistory without executing the SQL
```

### Step 3: Replace EnsureCreatedAsync in Program.cs

```csharp
// Before:
await context.Database.EnsureCreatedAsync();

// After:
await context.Database.MigrateAsync();
```

### Step 4: Future Migrations Work Normally

```bash
cc migrate add catalog AddProductWeight
cc migrate apply catalog
```

## Pre/Post Migration Scripts

For complex migrations that need data backfill:

```
src/Services/Catalog/CrownCommerce.Catalog.Infrastructure/
  Migrations/
    20260215_AddProductWeight.cs           # EF-generated migration
    20260215_AddProductWeight.pre.sql      # Runs BEFORE migration
    20260215_AddProductWeight.post.sql     # Runs AFTER migration
```

Example post-migration script (backfill default weights):

```sql
-- 20260215_AddProductWeight.post.sql
UPDATE HairProducts
SET Weight = CASE
    WHEN Type = 'Bundle' THEN 3.5
    WHEN Type = 'Closure' THEN 1.5
    WHEN Type = 'Frontal' THEN 2.0
    ELSE 2.5
END
WHERE Weight IS NULL;
```

## Environment-Specific Application

```bash
# Development (LocalDB) — applies immediately
cc migrate apply catalog

# Staging — applies with confirmation
cc migrate apply catalog --env staging
# ⚠ This will apply 1 pending migration to CrownCommerce_Catalog on crowncommerce-staging.database.windows.net
# Proceed? [y/N]

# Production — generates script for review, requires --confirm
cc migrate apply catalog --env production
# ⚠ Production deployment detected. Generating SQL script for review...
# Script saved to: migrations/catalog-20260215-AddProductWeight.sql
# Review the script and run: cc migrate apply catalog --env production --confirm
```
