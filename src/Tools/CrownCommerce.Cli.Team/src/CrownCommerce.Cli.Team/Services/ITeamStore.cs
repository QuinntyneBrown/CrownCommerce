using CrownCommerce.Cli.Team.Commands;

namespace CrownCommerce.Cli.Team.Services;

public interface ITeamStore
{
    Task<IReadOnlyList<TeamMember>> GetAllAsync();
    Task<TeamMember?> GetByEmailAsync(string email);
    Task AddAsync(TeamMember member);
    Task UpdateAsync(TeamMember member);
}
