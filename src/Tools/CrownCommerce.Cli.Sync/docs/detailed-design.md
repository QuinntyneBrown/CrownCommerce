# CrownCommerce.Cli.Sync - Detailed Design

## Purpose

Timezone-aware collaboration tool for distributed teams. Provides real-time team status visibility, asynchronous handoff notes between team members across timezones, inbox management, working-hours overlap calculation, and focus session tracking.

## Architecture

```
Commands (SyncCommand.cs)
    |
    v
ISyncService (interface)
    |
    v
SyncService (implementation)
    |
    +---> IHandoffStore (persist handoff notes and focus sessions)
    |         |
    |         v
    |     HandoffStore (JSON file-based: .crowncommerce/sync/)
    |
    +---> ITeamDirectory (team member registry)
              |
              v
          TeamDirectory (static in-memory list)
```

### Command Layer
- `SyncCommand.cs` - Defines the CLI command tree using System.CommandLine
- Resolves `ISyncService` from DI and delegates to the appropriate method
- No business logic in this layer

### Service Layer
- `ISyncService` / `SyncService` - Core business logic
- Depends on `IHandoffStore` and `ITeamDirectory` via constructor injection
- Handles timezone conversions, overlap calculations, duration parsing

### Storage Layer
- `IHandoffStore` / `HandoffStore` - JSON file-based persistence
  - Handoff notes: `.crowncommerce/sync/handoffs.json`
  - Focus sessions: `.crowncommerce/sync/focus.json`
- `ITeamDirectory` / `TeamDirectory` - Team member registry (static list, interface for testability)

## Commands

### `now` - Show Team Status
Displays each team member's current local time, timezone, and active focus session (if any). Gets members from `ITeamDirectory` and checks `IHandoffStore` for active focus sessions.

### `handoff --to <name> --message <msg>` - Create Handoff Note
Validates recipient exists via `ITeamDirectory`, then stores a `HandoffNote` via `IHandoffStore`. Each note has a unique ID, sender (current machine user), recipient, message, timestamp, and read status.

### `inbox` - View Pending Notes
Retrieves unread handoff notes for the current user from `IHandoffStore`. Displays each note and marks them as read.

### `overlap <member1> <member2> ...` - Find Overlapping Hours
Resolves requested members via `ITeamDirectory`, converts each member's 9:00-17:00 local working hours to UTC, then calculates the intersection. Displays the overlap window in each member's local time.

### `focus --duration <duration> --message <msg>` - Start Focus Session
Parses duration strings (e.g., "2h", "30m"), calculates end time, and stores a `FocusSession` via `IHandoffStore`. Active focus sessions appear in `now` output.

## Data Models

### TeamMember
```csharp
record TeamMember(string Name, string IanaTimezone, string WindowsTimezone)
```

### HandoffNote
```csharp
record HandoffNote(string Id, string From, string To, string Message, DateTime CreatedAt, bool Read)
```

### FocusSession
```csharp
record FocusSession(string Name, string Message, DateTime StartsAt, DateTime EndsAt)
```

## Timezone Calculation Approach

- All internal storage uses UTC (`DateTime.UtcNow`)
- Windows timezone IDs (`TimeZoneInfo.FindSystemTimeZoneById`) used for conversions on Windows
- IANA timezone names stored for display purposes
- Overlap calculation: Convert each member's local 9:00-17:00 to UTC ranges, then find the intersection (max of all starts, min of all ends)
- Focus session times stored in UTC, compared against `DateTime.UtcNow` for active status

## New Abstractions

### IHandoffStore
Persists handoff notes and focus sessions to JSON files in `.crowncommerce/sync/`.

```csharp
public interface IHandoffStore
{
    Task<IReadOnlyList<HandoffNote>> GetPendingNotesAsync(string recipient);
    Task AddNoteAsync(HandoffNote note);
    Task MarkReadAsync(string noteId);
    Task<FocusSession?> GetActiveFocusAsync(string name);
    Task SetFocusAsync(FocusSession session);
}
```

### ITeamDirectory
Team member registry, abstracted for testability.

```csharp
public interface ITeamDirectory
{
    Task<IReadOnlyList<TeamMember>> GetMembersAsync();
    Task<TeamMember?> GetMemberAsync(string name);
}
```

## Testing Strategy

All tests use **NSubstitute** to mock `IHandoffStore` and `ITeamDirectory`.

### SyncCommandTests
- Mock `ISyncService` to verify commands invoke the correct service methods
- Test that CLI arguments (--to, --message, --duration) are passed through correctly
- Verify exit codes

### SyncServiceTests
- Mock `IHandoffStore` and `ITeamDirectory` to test business logic in isolation
- Test timezone overlap calculation with controlled member data
- Test duration parsing ("2h", "30m")
- Test handoff creation stores notes correctly
- Test inbox retrieval and mark-as-read flow
- Test focus session storage with correct end times
- Test validation (e.g., recipient must exist in directory)
