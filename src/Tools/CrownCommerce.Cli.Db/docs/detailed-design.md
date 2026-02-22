# CrownCommerce.Cli.Db - Detailed Design

## Purpose

Database management CLI for CrownCommerce microservices. Provides commands to inspect connection strings, list registered databases, check database health, and reset service databases during development.

## Architecture

```
Program.cs (host setup + DI)
    |
    v
Commands/DbCommand.cs (System.CommandLine root + subcommands)
    |
    v
Services/IDatabaseService.cs (business logic interface)
    |
    v
Services/DatabaseService.cs (orchestration + service registry)
    |
    v
Services/IConnectionStringProvider.cs --> Services/ConnectionStringProvider.cs
    (reads IConfiguration or builds connection strings by convention)
```

The CLI follows the established CrownCommerce tool pattern:
1. `Program.cs` configures the host, registers services, and delegates to `DbCommand.Create(services)`.
2. `DbCommand` is a static factory that builds a `RootCommand` with subcommands.
3. Each subcommand resolves `IDatabaseService` from DI and calls the appropriate method.
4. `DatabaseService` maintains a registry of all 11 microservices and delegates connection-string resolution to `IConnectionStringProvider`.

## Commands

| Command | Arguments | Options | Description |
|---------|-----------|---------|-------------|
| `connection <service>` | `service` (required) | `--env` (default: `development`) | Outputs the connection string for a service database |
| `list` | none | none | Lists all registered service databases |
| `health [service]` | `service` (optional) | none | Checks database connectivity for one or all services |
| `reset <service>` | `service` (required) | `--env` (default: `development`), `--confirm` (required flag) | Resets a service database (drops and recreates) |

## Data Models

```csharp
public record DatabaseInfo(
    string ServiceName,
    string DatabaseName,
    string Provider,
    string ConnectionString);
```

## Service Registry

The `DatabaseService` maintains a static mapping of all 11 CrownCommerce microservices to their database names and providers:

| Service Key | Database Name | Provider |
|-------------|---------------|----------|
| catalog | CrownCommerce_Catalog | SqlServer |
| chat | CrownCommerce_Chat | SqlServer |
| content | CrownCommerce_Content | SqlServer |
| crm | CrownCommerce_Crm | SqlServer |
| identity | CrownCommerce_Identity | SqlServer |
| inquiry | CrownCommerce_Inquiry | SqlServer |
| newsletter | CrownCommerce_Newsletter | SqlServer |
| notification | CrownCommerce_Notification | SqlServer |
| order | CrownCommerce_Order | SqlServer |
| payment | CrownCommerce_Payment | SqlServer |
| scheduling | CrownCommerce_Scheduling | SqlServer |

## Interfaces

### IDatabaseService

Primary interface consumed by commands:

```csharp
Task<string> GetConnectionStringAsync(string service, string env);
Task<IReadOnlyList<DatabaseInfo>> ListDatabasesAsync();
Task<bool> CheckHealthAsync(string? service);
Task<bool> ResetDatabaseAsync(string service, string env);
```

### IConnectionStringProvider

Lower-level interface for connection string resolution:

```csharp
Task<string> GetConnectionStringAsync(string service, string env);
```

## Testing Strategy

- **Unit tests** mock `IDatabaseService` via NSubstitute to verify command routing and argument handling.
- **DatabaseService tests** mock `IConnectionStringProvider` to verify orchestration logic (registry lookups, health aggregation, reset flow).
- All tests run in-process without real database connections.
- Test structure uses xUnit with constructor-based setup and `Substitute.For<T>()` for interface mocking.
