namespace CrownCommerce.Cli.Team.Commands;

public record TeamMemberRequest(
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string? JobTitle,
    string? Department,
    string TimeZone);
