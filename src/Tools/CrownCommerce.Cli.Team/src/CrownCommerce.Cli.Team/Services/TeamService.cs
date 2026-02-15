using CrownCommerce.Cli.Team.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Team.Services;

public class TeamService : ITeamService
{
    private static readonly List<TeamMember> Members =
    [
        new("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"),
        new("amara@crowncommerce.io", "Amara", "Okafor", "Admin", "Engineering", "Africa/Lagos", "active"),
        new("wanjiku@crowncommerce.io", "Wanjiku", "Mwangi", "Customer", "Hair Styling", "Africa/Lagos", "active"),
        new("sophia@crowncommerce.io", "Sophia", "Chen", "Customer", "Marketing", "America/Toronto", "active"),
        new("james@crowncommerce.io", "James", "Wright", "Customer", "Operations", "Europe/London", "active"),
    ];

    private readonly ILogger<TeamService> _logger;

    public TeamService(ILogger<TeamService> logger) => _logger = logger;

    public Task<IReadOnlyList<TeamMember>> ListAsync(string? department, string status)
    {
        var filtered = Members
            .Where(m => m.Status == status)
            .Where(m => department is null || m.Department.Equals(department, StringComparison.OrdinalIgnoreCase))
            .ToList();

        return Task.FromResult<IReadOnlyList<TeamMember>>(filtered);
    }

    public Task AddAsync(TeamMemberRequest request)
    {
        _logger.LogInformation(
            "Adding team member {FirstName} {LastName} ({Email}) as {Role} in {Department}",
            request.FirstName, request.LastName, request.Email, request.Role, request.Department ?? "Unassigned");
        return Task.CompletedTask;
    }

    public Task<TeamMember?> GetAsync(string email)
    {
        var member = Members.Find(m => m.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(member);
    }

    public Task DeactivateAsync(string email)
    {
        _logger.LogInformation("Deactivating team member {Email}", email);
        return Task.CompletedTask;
    }
}
