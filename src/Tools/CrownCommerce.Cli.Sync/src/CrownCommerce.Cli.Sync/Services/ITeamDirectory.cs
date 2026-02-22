using CrownCommerce.Cli.Sync.Commands;

namespace CrownCommerce.Cli.Sync.Services;

public interface ITeamDirectory
{
    Task<IReadOnlyList<TeamMember>> GetMembersAsync();
    Task<TeamMember?> GetMemberAsync(string name);
}
