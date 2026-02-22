# CrownCommerce.Cli.Schedule - Detailed Design

## Purpose

Meeting and schedule manager CLI tool with timezone support. Provides commands to list meetings, create meetings, browse communication channels, and check team availability. Built on .NET 9 with System.CommandLine.

## Architecture

```
Commands (CLI layer)
    |
    v
IScheduleService (business logic)
    |
    v
IScheduleStore (persistence abstraction)
    |
    v
ScheduleStore (JSON file-based implementation)
    -> ~/.crowncommerce/schedule/meetings.json
    -> ~/.crowncommerce/schedule/channels.json
```

### Layers

- **Commands**: Defines CLI commands, options, and argument parsing. Delegates to `IScheduleService`. No business logic.
- **ScheduleService**: Orchestrates business logic. Parses `CreateMeetingRequest` into `Meeting` objects, applies filtering, delegates persistence to `IScheduleStore`.
- **IScheduleStore**: Abstraction for CRUD operations on meetings and channels. Enables testability via mocking.
- **ScheduleStore**: JSON file-based implementation. Reads/writes to `.crowncommerce/schedule/` under a configurable base path.

## Commands

| Command          | Description                        | Options                                    |
|------------------|------------------------------------|--------------------------------------------|
| `meetings`       | List scheduled meetings            | `--week` (bool), `--for` (email filter)    |
| `create-meeting` | Create a new meeting               | `--title`, `--start`, `--duration`, `--attendees`, `--location` |
| `channels`       | List communication channels        | `--type` (public/dm filter)                |
| `availability`   | Show team availability for a date  | `--date` (yyyy-MM-dd, required)            |

## Data Models

### Meeting

```csharp
public record Meeting(
    string Title,
    DateTime Start,
    string Duration,
    IReadOnlyList<string> Attendees,
    string? Location);
```

### CreateMeetingRequest

```csharp
public record CreateMeetingRequest(
    string Title,
    string Start,       // ISO 8601 string
    string Duration,    // e.g., "30m", "1h", "2h"
    IReadOnlyList<string> Attendees,
    string? Location);
```

### Channel

```csharp
public record Channel(string Name, string Type, int MemberCount);
```

### Availability

```csharp
public record Availability(
    string Email,
    string Name,
    string TimeZone,    // IANA timezone ID
    IReadOnlyList<string> FreeSlots);
```

## Persistence (IScheduleStore)

```csharp
public interface IScheduleStore
{
    Task<IReadOnlyList<Meeting>> GetMeetingsAsync(bool week, string? forEmail);
    Task AddMeetingAsync(Meeting meeting);
    Task<IReadOnlyList<Channel>> GetChannelsAsync(string? type);
    Task<IReadOnlyList<Availability>> GetAvailabilityAsync(string date);
}
```

### JSON File Store

- **Base path**: Configurable via `IConfiguration["Schedule:BasePath"]`, defaults to `~/.crowncommerce/schedule/`.
- **Files**:
  - `meetings.json`: Array of `Meeting` objects.
  - `channels.json`: Array of `Channel` objects.
- **Seeding**: On first access, if files do not exist, seed with default sample data.
- **Thread safety**: Uses `SemaphoreSlim` for concurrent access protection.

## Timezone Handling

- Meetings store `Start` as UTC `DateTime`.
- The `--start` option accepts ISO 8601 strings (e.g., `2025-03-15T10:00:00-05:00`), which are parsed and converted to UTC for storage.
- Availability records include an IANA `TimeZone` identifier so consumers can convert free slots to their local time.
- Duration is stored as a human-readable string (`30m`, `1h`, `2h`).

## Dependency Injection

```csharp
builder.Services.AddSingleton<IScheduleStore, ScheduleStore>();
builder.Services.AddSingleton<IScheduleService, ScheduleService>();
```

## Testing Strategy

### Unit Tests

- **ScheduleCommandTests**: Mock `IScheduleService` with NSubstitute. Verify each command invokes the correct service method with correct parameters. Verify exit codes.
- **ScheduleServiceTests**: Mock `IScheduleStore` with NSubstitute. Verify the service correctly delegates to the store, parses `CreateMeetingRequest` into `Meeting`, and applies default values.

### Test Doubles

- `IScheduleStore` is the primary seam for testing `ScheduleService` in isolation.
- `IScheduleService` is the primary seam for testing CLI commands in isolation.
- No integration tests against file system in unit test suite.
