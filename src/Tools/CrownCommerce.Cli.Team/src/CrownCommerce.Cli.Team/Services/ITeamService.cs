using CrownCommerce.Cli.Team.Commands;

namespace CrownCommerce.Cli.Team.Services;

public interface ITeamService
{
    Task<IReadOnlyList<TeamMember>> ListAsync(string? department, string status);
    Task AddAsync(TeamMemberRequest request);
    Task<TeamMember?> GetAsync(string email);
    Task DeactivateAsync(string email);
}
