using CrownCommerce.Cli.Team.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Team.Services;

public class TeamService : ITeamService
{
    private readonly ILogger<TeamService> _logger;
    private readonly ITeamStore _store;

    public TeamService(ILogger<TeamService> logger, ITeamStore store)
    {
        _logger = logger;
        _store = store;
    }

    public async Task<IReadOnlyList<TeamMember>> ListAsync(string? department, string status)
    {
        var all = await _store.GetAllAsync();

        var filtered = all
            .Where(m => m.Status.Equals(status, StringComparison.OrdinalIgnoreCase))
            .Where(m => department is null || m.Department.Equals(department, StringComparison.OrdinalIgnoreCase))
            .ToList();

        return filtered;
    }

    public async Task AddAsync(TeamMemberRequest request)
    {
        _logger.LogInformation(
            "Adding team member {FirstName} {LastName} ({Email}) as {Role} in {Department}",
            request.FirstName, request.LastName, request.Email, request.Role, request.Department ?? "Unassigned");

        var member = new TeamMember(
            Email: request.Email,
            FirstName: request.FirstName,
            LastName: request.LastName,
            Role: request.Role,
            Department: request.Department ?? "Unassigned",
            TimeZone: request.TimeZone,
            Status: "active");

        await _store.AddAsync(member);
    }

    public async Task<TeamMember?> GetAsync(string email)
    {
        return await _store.GetByEmailAsync(email);
    }

    public async Task DeactivateAsync(string email)
    {
        _logger.LogInformation("Deactivating team member {Email}", email);

        var member = await _store.GetByEmailAsync(email);

        if (member is not null)
        {
            var updated = member with { Status = "inactive" };
            await _store.UpdateAsync(updated);
        }
    }
}
