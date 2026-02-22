using System.CommandLine;
using CrownCommerce.Cli.Team.Commands;
using CrownCommerce.Cli.Team.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Team.Tests;

public class TeamCommandTests
{
    private readonly ITeamService _teamService;

    public TeamCommandTests()
    {
        _teamService = Substitute.For<ITeamService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_teamService);
        return TeamCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task List_ReturnsZero_AndCallsListAsync()
    {
        _teamService.ListAsync(null, "active").Returns(new List<TeamMember>
        {
            new("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"),
        });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["list"]);

        Assert.Equal(0, exitCode);
        await _teamService.Received(1).ListAsync(null, "active");
    }

    [Fact]
    public async Task List_WithDepartment_FiltersByDepartment()
    {
        _teamService.ListAsync("Engineering", "active").Returns(new List<TeamMember>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["list", "--department", "Engineering"]);

        Assert.Equal(0, exitCode);
        await _teamService.Received(1).ListAsync("Engineering", "active");
    }

    [Fact]
    public async Task List_WithStatus_PassesStatusFilter()
    {
        _teamService.ListAsync(null, "inactive").Returns(new List<TeamMember>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["list", "--status", "inactive"]);

        Assert.Equal(0, exitCode);
        await _teamService.Received(1).ListAsync(null, "inactive");
    }

    [Fact]
    public async Task Add_WithRequiredOptions_CallsAddAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync([
            "add",
            "--email", "new@crowncommerce.io",
            "--first-name", "New",
            "--last-name", "Member"
        ]);

        Assert.Equal(0, exitCode);
        await _teamService.Received(1).AddAsync(Arg.Any<TeamMemberRequest>());
    }

    [Fact]
    public async Task Add_PassesAllFieldsCorrectly()
    {
        TeamMemberRequest? capturedRequest = null;
        await _teamService.AddAsync(Arg.Do<TeamMemberRequest>(r => capturedRequest = r));

        var command = CreateCommand();
        await command.InvokeAsync([
            "add",
            "--email", "test@crowncommerce.io",
            "--first-name", "Test",
            "--last-name", "User",
            "--role", "Admin",
            "--job-title", "Developer",
            "--department", "Engineering",
            "--timezone", "Europe/London"
        ]);

        Assert.NotNull(capturedRequest);
        Assert.Equal("test@crowncommerce.io", capturedRequest!.Email);
        Assert.Equal("Test", capturedRequest.FirstName);
        Assert.Equal("User", capturedRequest.LastName);
        Assert.Equal("Admin", capturedRequest.Role);
        Assert.Equal("Developer", capturedRequest.JobTitle);
        Assert.Equal("Engineering", capturedRequest.Department);
        Assert.Equal("Europe/London", capturedRequest.TimeZone);
    }

    [Fact]
    public async Task Show_WithEmail_CallsGetAsync()
    {
        _teamService.GetAsync("quinn@crowncommerce.io").Returns(
            new TeamMember("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"));

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["show", "quinn@crowncommerce.io"]);

        Assert.Equal(0, exitCode);
        await _teamService.Received(1).GetAsync("quinn@crowncommerce.io");
    }

    [Fact]
    public async Task Show_WithUnknownEmail_ReturnsOne()
    {
        _teamService.GetAsync("unknown@crowncommerce.io").Returns((TeamMember?)null);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["show", "unknown@crowncommerce.io"]);

        Assert.Equal(1, exitCode);
    }

    [Fact]
    public async Task Deactivate_CallsDeactivateAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["deactivate", "quinn@crowncommerce.io"]);

        Assert.Equal(0, exitCode);
        await _teamService.Received(1).DeactivateAsync("quinn@crowncommerce.io");
    }
}

public class TeamServiceTests
{
    private readonly ITeamStore _store;
    private readonly TeamService _service;

    public TeamServiceTests()
    {
        _store = Substitute.For<ITeamStore>();
        var logger = NullLoggerFactory.Instance.CreateLogger<TeamService>();
        _service = new TeamService(logger, _store);
    }

    [Fact]
    public async Task ListAsync_FiltersByDepartment()
    {
        _store.GetAllAsync().Returns(new List<TeamMember>
        {
            new("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"),
            new("sophia@crowncommerce.io", "Sophia", "Chen", "Customer", "Marketing", "America/Toronto", "active"),
        });

        var result = await _service.ListAsync("Engineering", "active");

        Assert.Single(result);
        Assert.Equal("quinn@crowncommerce.io", result[0].Email);
    }

    [Fact]
    public async Task ListAsync_FiltersByStatus()
    {
        _store.GetAllAsync().Returns(new List<TeamMember>
        {
            new("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"),
            new("james@crowncommerce.io", "James", "Wright", "Customer", "Operations", "Europe/London", "inactive"),
        });

        var result = await _service.ListAsync(null, "inactive");

        Assert.Single(result);
        Assert.Equal("james@crowncommerce.io", result[0].Email);
    }

    [Fact]
    public async Task ListAsync_WithNullDepartment_ReturnsAllMatchingStatus()
    {
        _store.GetAllAsync().Returns(new List<TeamMember>
        {
            new("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active"),
            new("sophia@crowncommerce.io", "Sophia", "Chen", "Customer", "Marketing", "America/Toronto", "active"),
            new("james@crowncommerce.io", "James", "Wright", "Customer", "Operations", "Europe/London", "inactive"),
        });

        var result = await _service.ListAsync(null, "active");

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task AddAsync_CreatesMemberWithActiveStatus_AndStores()
    {
        var request = new TeamMemberRequest(
            "new@crowncommerce.io", "New", "Member", "Customer", "Developer", "Engineering", "America/Toronto");

        await _service.AddAsync(request);

        await _store.Received(1).AddAsync(Arg.Is<TeamMember>(m =>
            m.Email == "new@crowncommerce.io" &&
            m.FirstName == "New" &&
            m.LastName == "Member" &&
            m.Role == "Customer" &&
            m.Department == "Engineering" &&
            m.TimeZone == "America/Toronto" &&
            m.Status == "active"));
    }

    [Fact]
    public async Task GetAsync_ReturnsMemberFromStore()
    {
        var expected = new TeamMember("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active");
        _store.GetByEmailAsync("quinn@crowncommerce.io").Returns(expected);

        var result = await _service.GetAsync("quinn@crowncommerce.io");

        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetAsync_ReturnsNull_ForUnknownEmail()
    {
        _store.GetByEmailAsync("unknown@crowncommerce.io").Returns((TeamMember?)null);

        var result = await _service.GetAsync("unknown@crowncommerce.io");

        Assert.Null(result);
    }

    [Fact]
    public async Task DeactivateAsync_UpdatesMemberStatus_ToInactive()
    {
        var member = new TeamMember("quinn@crowncommerce.io", "Quinn", "Brown", "Admin", "Engineering", "America/Toronto", "active");
        _store.GetByEmailAsync("quinn@crowncommerce.io").Returns(member);

        await _service.DeactivateAsync("quinn@crowncommerce.io");

        await _store.Received(1).UpdateAsync(Arg.Is<TeamMember>(m =>
            m.Email == "quinn@crowncommerce.io" &&
            m.Status == "inactive"));
    }

    [Fact]
    public async Task DeactivateAsync_WithUnknownEmail_HandlesGracefully()
    {
        _store.GetByEmailAsync("unknown@crowncommerce.io").Returns((TeamMember?)null);

        await _service.DeactivateAsync("unknown@crowncommerce.io");

        await _store.DidNotReceive().UpdateAsync(Arg.Any<TeamMember>());
    }
}
