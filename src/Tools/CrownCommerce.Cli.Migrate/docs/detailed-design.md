# CrownCommerce.Cli.Migrate - Detailed Design

## Purpose

EF Core database migration manager for all CrownCommerce microservices. Provides a single CLI tool to add, apply, and check the status of Entity Framework Core migrations across the entire distributed system.

## Architecture

```
Commands (System.CommandLine)
    |
    v
IMigrationService (business logic)
    |
    v
IProcessRunner (process execution abstraction)
    |
    v
dotnet ef CLI (external process)
```

### Layers

- **Commands** - System.CommandLine definitions that parse CLI arguments and delegate to `IMigrationService`
- **MigrationService** - Orchestrates migration operations using the service registry and `IProcessRunner`
- **IProcessRunner** - Abstraction over `System.Diagnostics.Process` for testability

## Commands

### `add <service> <name>`

Adds a new EF Core migration to the specified microservice.

```bash
cc-migrate add catalog AddProductCategories
```

Runs: `dotnet ef migrations add <name> --project <path> --context <DbContext>`

### `apply <service> [--env <environment>]`

Applies pending migrations to the specified microservice database.

```bash
cc-migrate apply catalog --env staging
```

Runs: `dotnet ef database update --project <path> --context <DbContext>`

### `status [--env <environment>]`

Shows migration status for all 11 microservices.

```bash
cc-migrate status --env production
```

Runs: `dotnet ef migrations list --project <path> --context <DbContext>` for each service and parses the output to determine applied vs pending migration counts.

## Service Registry

Maps 11 microservices to their infrastructure project paths and DbContext names:

| Service       | Infrastructure Project Path                                        | DbContext              |
|---------------|-------------------------------------------------------------------|------------------------|
| catalog       | src/Services/Catalog/CrownCommerce.Catalog.Infrastructure         | CatalogDbContext       |
| chat          | src/Services/Chat/CrownCommerce.Chat.Infrastructure               | ChatDbContext          |
| content       | src/Services/Content/CrownCommerce.Content.Infrastructure         | ContentDbContext       |
| crm           | src/Services/Crm/CrownCommerce.Crm.Infrastructure                | CrmDbContext           |
| identity      | src/Services/Identity/CrownCommerce.Identity.Infrastructure       | IdentityDbContext      |
| inquiry       | src/Services/Inquiry/CrownCommerce.Inquiry.Infrastructure         | InquiryDbContext       |
| newsletter    | src/Services/Newsletter/CrownCommerce.Newsletter.Infrastructure   | NewsletterDbContext    |
| notification  | src/Services/Notification/CrownCommerce.Notification.Infrastructure | NotificationDbContext |
| order         | src/Services/Order/CrownCommerce.Order.Infrastructure             | OrderDbContext         |
| payment       | src/Services/Payment/CrownCommerce.Payment.Infrastructure         | PaymentDbContext       |
| scheduling    | src/Services/Scheduling/CrownCommerce.Scheduling.Infrastructure   | SchedulingDbContext    |

## IProcessRunner Abstraction

```csharp
public record ProcessResult(int ExitCode, string Output, string Error);

public interface IProcessRunner
{
    Task<ProcessResult> RunAsync(string fileName, string arguments);
}
```

The `ProcessRunner` implementation wraps `System.Diagnostics.Process` with:
- Redirected stdout/stderr capture
- Async execution via `WaitForExitAsync`
- Structured result via `ProcessResult` record

## Testing Strategy

- **Unit tests** mock `IProcessRunner` via NSubstitute to verify:
  - Correct `dotnet ef` commands are constructed for each operation
  - Service registry validation (unknown services rejected)
  - Process failure handling (non-zero exit codes)
  - Status parsing for all 11 services
- **Command tests** mock `IMigrationService` to verify:
  - CLI argument parsing and routing
  - Default values (e.g., `--env development`)
  - Exit code propagation

## DI Registration

```csharp
builder.Services.AddSingleton<IProcessRunner, ProcessRunner>();
builder.Services.AddSingleton<IMigrationService, MigrationService>();
```
