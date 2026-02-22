# CrownCommerce.Cli.Team - Detailed Design

## Purpose

Team member management CLI for CrownCommerce. Provides commands to list, add, show, and deactivate team members across Identity and Scheduling services.

## Architecture

```
Commands (TeamCommand.cs)
    |
    v
ITeamService (TeamService.cs)
    |
    v
ITeamStore (TeamStore.cs - JSON file persistence)
```

- **Commands** parse CLI arguments via System.CommandLine, resolve `ITeamService` from DI, and delegate to service methods.
- **TeamService** contains business logic: filtering, status management, and mapping between request/response models.
- **ITeamStore** abstracts persistence. The default implementation (`TeamStore`) reads/writes a JSON file at `~/.crowncommerce/team/members.json`.

## Commands

| Command      | Description                          | Options / Arguments                                                   |
|-------------|--------------------------------------|-----------------------------------------------------------------------|
| `list`      | List team members                    | `--department` (optional filter), `--status` (default: "active")      |
| `add`       | Add a new team member                | `--email`, `--first-name`, `--last-name`, `--role`, `--job-title`, `--department`, `--timezone` |
| `show`      | Show details for a team member       | `<email>` (positional argument)                                       |
| `deactivate`| Deactivate a team member             | `<email>` (positional argument)                                       |

## Data Models

### TeamMember

```csharp
public record TeamMember(
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string Department,
    string TimeZone,
    string Status);
```

### TeamMemberRequest

```csharp
public record TeamMemberRequest(
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string? JobTitle,
    string? Department,
    string TimeZone);
```

## Abstraction: ITeamStore

```csharp
public interface ITeamStore
{
    Task<IReadOnlyList<TeamMember>> GetAllAsync();
    Task<TeamMember?> GetByEmailAsync(string email);
    Task AddAsync(TeamMember member);
    Task UpdateAsync(TeamMember member);
}
```

The default `TeamStore` implementation persists data as JSON to `~/.crowncommerce/team/members.json`. On first access, if the file does not exist, it seeds 5 default team members.

## Testing Strategy

- **TeamCommandTests**: Mock `ITeamService` via NSubstitute. Verify each command invokes the correct service method with expected arguments and returns the correct exit code.
- **TeamServiceTests**: Mock `ITeamStore` via NSubstitute. Verify business logic such as filtering, status assignment on add, and status update on deactivate.
