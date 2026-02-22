# CrownCommerce.Cli.Logs - Detailed Design

## Purpose

CrownCommerce.Cli.Logs is a centralized log viewer CLI tool for CrownCommerce microservices. It provides developers with a single interface to tail logs across multiple services, filter by log level and search text, apply time windows, and optionally write output to a file.

## Architecture

```
Commands (System.CommandLine)
    |
    v
LogService
    |
    +-- ILogSource (reads structured logs from files)
```

### Dependency Flow

- **Commands layer** (`LogsCommand.cs`): Defines the CLI grammar (--service, --level, --search, --since, --output) and delegates to `ILogService`.
- **Service layer** (`LogService`): Orchestrates log reading, filtering, formatting, and output.
- **Abstraction layer**: `ILogSource` provides a testable seam for log reading operations.

### DI Registration (Program.cs)

```csharp
builder.Services.AddSingleton<ILogSource, LogSource>();
builder.Services.AddSingleton<ILogService, LogService>();
```

## Commands

| Option      | Description                                    | Example                          |
|-------------|------------------------------------------------|----------------------------------|
| `--service` | Service names to tail (repeatable)             | `--service catalog --service order` |
| `--level`   | Log level filter (error, warning, info, debug) | `--level error`                  |
| `--search`  | Search text filter (case-insensitive)          | `--search "timeout"`             |
| `--since`   | Time window (e.g., 1h, 30m, 2d)               | `--since 1h`                     |
| `--output`  | Output file path                               | `--output /tmp/logs.txt`         |

When no `--service` is specified, all known services are queried.

## Data Model

### LogEntry

```csharp
public record LogEntry(
    DateTime Timestamp,
    string Level,
    string Service,
    string Message,
    string? Exception = null);
```

Represents a single structured log entry from any service.

## Abstractions

### ILogSource

Reads structured logs from a backing store (JSON log files).

```csharp
public interface ILogSource
{
    Task<IReadOnlyList<LogEntry>> ReadLogsAsync(string[] services, string? since = null);
}
```

- Reads from `.crowncommerce/logs/{service}.log` files
- Each file contains JSON lines (one JSON object per line)
- The `since` parameter filters entries by time window

### LogSource (Implementation)

- Configurable logs directory (default: `.crowncommerce/logs/`)
- Reads `{service}.log` for each requested service
- Parses JSON lines into `LogEntry` records
- Applies `since` time window filtering at the source level
- Returns empty list for missing service log files

## Service Behavior

### LogService.TailLogsAsync

1. Determines target services (provided list or `AllServices` default)
2. Calls `ILogSource.ReadLogsAsync()` with services and since filter
3. Applies level filter (case-insensitive match on `LogEntry.Level`)
4. Applies search filter (case-insensitive substring match on `LogEntry.Message`)
5. Sorts results by timestamp ascending
6. Formats each entry as `[{Timestamp:HH:mm:ss}] [{Level}] [{Service}] {Message}`
7. If exception is present, appends it on the next line
8. Writes formatted output to console
9. If `--output` specified, also writes to the given file path

### AllServices Registry

```
catalog, content, identity, inquiry, newsletter,
notification, order, payment, chat, crm, scheduling
```

## Log File Format

Each service log file contains one JSON object per line:

```json
{"timestamp":"2026-02-21T10:30:00","level":"Error","service":"catalog","message":"Connection timeout","exception":"System.TimeoutException: ..."}
{"timestamp":"2026-02-21T10:30:01","level":"Info","service":"catalog","message":"Request completed"}
```

## Time Window Parsing

The `--since` option supports:
- `Nh` - N hours ago (e.g., `1h`, `24h`)
- `Nm` - N minutes ago (e.g., `30m`)
- `Nd` - N days ago (e.g., `7d`)

## Testing Strategy

Tests mock `ILogSource` via NSubstitute, allowing full verification of `LogService` logic without file system dependencies.

### LogsCommandTests

Verify that CLI options correctly resolve `ILogService` from DI and call `TailLogsAsync` with correct arguments:

- Default invocation (no args) passes null services
- Single `--service` passes correct service filter
- Multiple `--service` passes array of services
- `--level` passes level filter
- `--search` passes search filter
- `--since` passes since filter
- `--output` passes output path
- Combination of all flags passes all values correctly

### LogServiceTests

Verify orchestration logic with mocked `ILogSource`:

- Null services queries all known services
- Specific services queries only those services
- Level filter only returns matching entries
- Search filter only returns matching entries
- Since filter is passed to log source
- Output option writes formatted logs to file
- No matching logs returns gracefully
