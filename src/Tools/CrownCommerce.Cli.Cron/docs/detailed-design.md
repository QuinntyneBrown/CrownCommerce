# CrownCommerce.Cli.Cron - Detailed Design

## Purpose

CrownCommerce.Cli.Cron (`cc-cron`) is a local job scheduler CLI tool for managing and running recurring background tasks. It provides commands to list registered cron jobs, trigger individual jobs on demand, start a daemon that evaluates cron schedules, and view execution history.

## Architecture

The tool follows a three-layer architecture:

```
Commands layer (CLI parsing)
    |
    v
Service layer (business logic)
    |
    v
Store layer (persistence)
```

### Commands Layer

Responsible for CLI argument parsing and output formatting using `System.CommandLine`. This layer resolves `ICronService` from DI and delegates all business logic to it. The commands layer does not contain any business logic itself.

### Service Layer

Contains `ICronService` and its implementation `CronService`, which orchestrates business logic. It coordinates between `ICronJobStore` (persistence) and `ICronJobRunner` (execution). The service layer is the only layer that combines store reads, job execution, and history recording.

### Store Layer

Contains `ICronJobStore` and its JSON file-based implementation `CronJobStore`. Handles reading/writing job definitions and execution history to local JSON files.

## Commands

| Command   | Description                          | Arguments / Options              |
|-----------|--------------------------------------|----------------------------------|
| `list`    | List all registered cron jobs        | (none)                           |
| `run`     | Run a specific cron job immediately  | `<job-name>` (required argument) |
| `start`   | Start the cron daemon                | `--job` (optional filter)        |
| `history` | Show job execution history           | `[job-name]` (optional argument) |

## Service Interface

```csharp
public interface ICronService
{
    Task<IReadOnlyList<CronJobDefinition>> ListJobsAsync();
    Task<bool> RunJobAsync(string jobName);
    Task StartDaemonAsync(string? jobFilter);
    Task<IReadOnlyList<CronJobHistory>> GetHistoryAsync(string? jobName);
}
```

## Abstractions

### ICronJobStore

Persistence abstraction for job definitions and execution history. The default implementation (`CronJobStore`) uses JSON files stored at a configurable base path (default: `.crowncommerce/cron/`).

```csharp
public interface ICronJobStore
{
    Task<IReadOnlyList<CronJobDefinition>> LoadJobsAsync();
    Task SaveJobsAsync(IReadOnlyList<CronJobDefinition> jobs);
    Task<IReadOnlyList<CronJobHistory>> LoadHistoryAsync(string? jobName = null);
    Task AppendHistoryAsync(CronJobHistory entry);
}
```

Files managed:
- `jobs.json` - Array of `CronJobDefinition` records
- `history.json` - Array of `CronJobHistory` records

### ICronJobRunner

Execution abstraction for triggering job HTTP callbacks against target services.

```csharp
public interface ICronJobRunner
{
    Task<(bool Success, string? Error)> RunJobAsync(CronJobDefinition job);
}
```

The default implementation (`CronJobRunner`) makes an HTTP POST request to the target service's job endpoint using the convention: `http://localhost:{port}/api/jobs/{jobName}/run`.

## Data Models

### CronJobDefinition

```csharp
public record CronJobDefinition(
    string Name,
    string Schedule,
    string TargetService,
    string Description
);
```

### CronJobHistory

```csharp
public record CronJobHistory(
    string JobName,
    DateTime ExecutedAt,
    string Status,
    string? Error = null
);
```

## Error Handling Strategy

- **Job not found**: `RunJobAsync` returns `false` when the requested job name does not exist in the store. The CLI command translates this to exit code 1.
- **HTTP failures**: `CronJobRunner` catches `HttpRequestException` and `TaskCanceledException`, returning `(false, errorMessage)`. The service records the failure in history.
- **Store I/O errors**: `CronJobStore` handles missing files gracefully by returning empty collections. Write errors propagate as exceptions to the calling command.
- **Daemon mode**: `StartDaemonAsync` logs the jobs that would be scheduled and returns without blocking (for CLI demo purposes).

## Testing Strategy

Tests mock `ICronJobStore` and `ICronJobRunner` (for `CronServiceTests`) and `ICronService` (for `CronCommandTests`) using NSubstitute.

### CronCommandTests

Tests the CLI commands end-to-end by creating a `RootCommand` with a mocked `ICronService`, invoking it with argument arrays, and asserting:
- Correct exit codes
- Correct service method calls with expected arguments

### CronServiceTests

Tests the `CronService` class directly by injecting mocked `ICronJobStore` and `ICronJobRunner`:
- `ListJobsAsync` delegates to store
- `RunJobAsync` finds job, calls runner, records history (success and failure paths)
- `RunJobAsync` with unknown job returns false without calling runner
- `GetHistoryAsync` delegates to store with optional filter
- `StartDaemonAsync` loads jobs from store

## Dependency Registration

```csharp
builder.Services.AddSingleton<ICronJobStore, CronJobStore>();
builder.Services.AddSingleton<ICronJobRunner, CronJobRunner>();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<ICronService, CronService>();
```
