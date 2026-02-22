using System.Text.Json;
using CrownCommerce.Cli.Team.Commands;

namespace CrownCommerce.Cli.Team.Services;

public class TeamStore : ITeamStore
{
    private static readonly string DataDirectory = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
        ".crowncommerce", "team");

    private static readonly string DataFilePath = Path.Combine(DataDirectory, "members.json");

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private static readonly List<TeamMember> DefaultMembers =
    [
        new("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"),
        new("amara@crowncommerce.io", "Amara", "Okafor", "Admin", "Engineering", "Africa/Lagos", "active"),
        new("wanjiku@crowncommerce.io", "Wanjiku", "Mwangi", "Customer", "Hair Styling", "Africa/Lagos", "active"),
        new("sophia@crowncommerce.io", "Sophia", "Chen", "Customer", "Marketing", "America/Toronto", "active"),
        new("james@crowncommerce.io", "James", "Wright", "Customer", "Operations", "Europe/London", "active"),
    ];

    public async Task<IReadOnlyList<TeamMember>> GetAllAsync()
    {
        var members = await LoadAsync();
        return members.AsReadOnly();
    }

    public async Task<TeamMember?> GetByEmailAsync(string email)
    {
        var members = await LoadAsync();
        return members.Find(m => m.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }

    public async Task AddAsync(TeamMember member)
    {
        var members = await LoadAsync();
        members.Add(member);
        await SaveAsync(members);
    }

    public async Task UpdateAsync(TeamMember member)
    {
        var members = await LoadAsync();
        var index = members.FindIndex(m => m.Email.Equals(member.Email, StringComparison.OrdinalIgnoreCase));

        if (index >= 0)
        {
            members[index] = member;
            await SaveAsync(members);
        }
    }

    private async Task<List<TeamMember>> LoadAsync()
    {
        if (!File.Exists(DataFilePath))
        {
            await SeedAsync();
        }

        var json = await File.ReadAllTextAsync(DataFilePath);
        return JsonSerializer.Deserialize<List<TeamMember>>(json, JsonOptions) ?? [];
    }

    private async Task SaveAsync(List<TeamMember> members)
    {
        Directory.CreateDirectory(DataDirectory);
        var json = JsonSerializer.Serialize(members, JsonOptions);
        await File.WriteAllTextAsync(DataFilePath, json);
    }

    private async Task SeedAsync()
    {
        await SaveAsync(new List<TeamMember>(DefaultMembers));
    }
}
