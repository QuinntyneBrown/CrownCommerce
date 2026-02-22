# CrownCommerce.Cli.Env - Detailed Design

## Purpose

CrownCommerce.Cli.Env is an environment and health manager CLI tool for CrownCommerce services. It provides developers with a single interface to check service health, inspect port assignments, list databases, and manage process lifecycle across the entire CrownCommerce platform.

## Architecture

```
Commands (System.CommandLine)
    |
    v
EnvironmentService
    |
    +-- IHealthChecker (HTTP health checks)
    |
    +-- IProcessManager (start/stop processes)
```

### Dependency Flow

- **Commands layer** (`EnvCommand.cs`): Defines the CLI grammar (health, databases, ports, up, down) and delegates to `IEnvironmentService`.
- **Service layer** (`EnvironmentService`): Orchestrates health checking, database listing, port display, and process management.
- **Abstraction layer**: `IHealthChecker` and `IProcessManager` provide testable seams for HTTP and process operations.

### DI Registration (Program.cs)

```csharp
builder.Services.AddHttpClient();
builder.Services.AddSingleton<IHealthChecker, HealthChecker>();
builder.Services.AddSingleton<IProcessManager, ProcessManager>();
builder.Services.AddSingleton<IEnvironmentService, EnvironmentService>();
```

## Commands

| Command     | Description                           | Options                                |
|-------------|---------------------------------------|----------------------------------------|
| `health`    | Check health of all services          | `--env <environment>` (default: development) |
| `databases` | List all service databases            | (none)                                 |
| `ports`     | List all service port assignments     | (none)                                 |
| `up`        | Start services and frontends          | `--services <csv>`, `--frontends <csv>` |
| `down`      | Stop all running processes            | (none)                                 |

## Abstractions

### IHealthChecker

Performs HTTP health checks against service endpoints.

```csharp
public record HealthCheckResult(string ServiceName, int Port, bool IsHealthy, string? Error = null);

public interface IHealthChecker
{
    Task<HealthCheckResult> CheckAsync(string serviceName, int port);
}
```

- Calls `GET http://localhost:{port}/health`
- Returns `IsHealthy = true` on 2xx responses
- Returns `IsHealthy = false` with error message on failure or non-2xx

### IProcessManager

Manages process lifecycle for services and frontends.

```csharp
public interface IProcessManager
{
    Task<bool> StartAsync(string name, string command, string arguments);
    Task StopAllAsync();
    IReadOnlyList<string> GetRunningProcesses();
}
```

- Tracks started processes by name
- `StopAllAsync()` kills all tracked processes
- `GetRunningProcesses()` returns names of currently running processes

## Port Map Registry

The port map contains 19 entries across three categories:

| Name                    | Port | Category       |
|-------------------------|------|----------------|
| catalog                 | 5100 | service        |
| content                 | 5050 | service        |
| identity                | 5070 | service        |
| inquiry                 | 5200 | service        |
| newsletter              | 5800 | service        |
| notification            | 5060 | service        |
| order                   | 5030 | service        |
| payment                 | 5041 | service        |
| chat                    | 5095 | service        |
| crm                     | 5090 | service        |
| scheduling              | 5280 | service        |
| api-gateway             | 5000 | infrastructure |
| rabbitmq                | 5672 | infrastructure |
| origin-hair-collective  | 4201 | frontend       |
| origin-coming-soon      | 4202 | frontend       |
| mane-haus               | 4203 | frontend       |
| mane-haus-coming-soon   | 4204 | frontend       |
| teams                   | 4205 | frontend       |
| admin                   | 4206 | frontend       |

## EnvironmentService Behavior

### CheckHealthAsync(env)

1. Iterates the port map
2. Calls `IHealthChecker.CheckAsync()` for each entry
3. Displays results as a formatted table with status indicators

### ListDatabasesAsync()

1. Filters port map for `service` category entries
2. Derives database names using convention: `CrownCommerce_{PascalCaseName}`
3. Example: `catalog` becomes `CrownCommerce_Catalog`

### ListPortsAsync()

1. Prints the full port map as a formatted table (Name, Port, Category)

### StartAsync(services?, frontends?)

1. Filters port map entries based on provided service/frontend name filters
2. If no filters provided, starts all entries
3. Uses `IProcessManager.StartAsync()` for each matching entry

### StopAsync()

1. Calls `IProcessManager.StopAllAsync()` to stop all tracked processes

## Testing Strategy

Tests mock `IHealthChecker` and `IProcessManager` via NSubstitute, allowing full verification of `EnvironmentService` logic without network or process dependencies.

### EnvCommandTests

Verify that each CLI command correctly resolves `IEnvironmentService` from DI and calls the appropriate method with correct arguments.

### EnvironmentServiceTests

Verify orchestration logic:

- Health checks are issued for every port map entry
- Database names are correctly derived from service entries only
- Port listing returns all 18 entries
- Service/frontend filters are applied correctly during startup
- Stop delegates to `IProcessManager.StopAllAsync()`
- Unhealthy services are handled gracefully without throwing
