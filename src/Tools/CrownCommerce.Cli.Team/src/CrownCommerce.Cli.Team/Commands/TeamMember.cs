namespace CrownCommerce.Cli.Team.Commands;

public record TeamMember(
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string Department,
    string TimeZone,
    string Status);
