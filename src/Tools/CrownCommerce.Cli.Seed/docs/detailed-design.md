# CrownCommerce.Cli.Seed - Detailed Design

## Purpose

Database seeder CLI tool for CrownCommerce microservices. Provides a unified interface to seed development and test databases with consistent, profile-based data sets across all microservices.

## Architecture

```
Commands (SeedCommand)
    |
    v
ISeedService (SeedService)
    |
    v
ISeederRunner (SeederRunner)
    |
    v
dotnet run --project src/Services/{Service}/CrownCommerce.{Service}.Api -- seed --profile {profile}
```

### Layer Responsibilities

- **Commands**: Parses CLI arguments and options via System.CommandLine. Routes to ISeedService.
- **SeedService**: Orchestrates seeding logic. Validates service names and profiles, handles dry-run mode, iterates services for "all" target, collects and displays results.
- **ISeederRunner**: Abstraction for executing seed commands per service. Enables testability by decoupling process execution from orchestration logic.
- **SeederRunner**: Concrete implementation that spawns `dotnet run` processes targeting each microservice's seed command.

## Commands

### Root Command

```
crowncommerce-seed <service> [options]
```

**Arguments:**
- `service` (required): Target microservice name or `all` to seed every service with a seeder.

**Options:**
- `--profile <profile>`: Seed data profile to use. Default: `demo`.
- `--reset`: Reset (clear) existing data before seeding. Default: `false`.
- `--dry-run`: Preview seed operations without executing them. Default: `false`.

## Profiles

| Profile     | Purpose                                      |
|-------------|----------------------------------------------|
| `minimal`   | Bare minimum data for the app to function    |
| `demo`      | Rich demo data for showcasing features       |
| `load-test` | High-volume data for performance testing     |
| `e2e`       | Deterministic data for end-to-end tests      |

## Services with Seeders

| Service      | Description                        |
|--------------|------------------------------------|
| `catalog`    | Product catalog and categories     |
| `content`    | CMS content and pages              |
| `identity`   | Users, roles, and permissions      |
| `newsletter` | Newsletter subscribers and campaigns |
| `scheduling` | Appointments and availability      |

## Key Types

### SeedResult

Record capturing the outcome of a single service seed operation:
- `Service`: The service that was seeded
- `Profile`: The profile used
- `Success`: Whether the operation succeeded
- `RecordsCreated`: Number of records created
- `Error`: Optional error message on failure

### ISeederRunner

Interface with a single method:
```csharp
Task<SeedResult> RunSeedAsync(string service, string profile, bool reset);
```

### SeederRunner

Executes seed commands by spawning a child process:
```
dotnet run --project src/Services/{Service}/CrownCommerce.{Service}.Api -- seed --profile {profile} [--reset]
```

Parses stdout for record count. Returns a SeedResult with success/failure status.

## Testing Strategy

- **Unit tests mock ISeederRunner** to verify SeedService orchestration logic without spawning real processes.
- **SeedCommandTests**: Verify CLI argument parsing and routing to ISeedService.
- **SeedServiceTests**: Verify validation, dry-run behavior, all-services iteration, result collection, and error handling.
