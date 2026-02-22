using CrownCommerce.Cli.Sync.Commands;

namespace CrownCommerce.Cli.Sync.Services;

public class TeamDirectory : ITeamDirectory
{
    private static readonly IReadOnlyList<TeamMember> Members = new List<TeamMember>
    {
        new("Quinn", "America/Toronto", "Eastern Standard Time"),
        new("Amara", "Africa/Lagos", "W. Africa Standard Time"),
        new("Wanjiku", "Africa/Lagos", "W. Africa Standard Time"),
        new("Sophia", "America/Toronto", "Eastern Standard Time"),
        new("James", "Europe/London", "GMT Standard Time"),
    }.AsReadOnly();

    public Task<IReadOnlyList<TeamMember>> GetMembersAsync()
    {
        return Task.FromResult(Members);
    }

    public Task<TeamMember?> GetMemberAsync(string name)
    {
        var member = Members.FirstOrDefault(m =>
            m.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(member);
    }
}
