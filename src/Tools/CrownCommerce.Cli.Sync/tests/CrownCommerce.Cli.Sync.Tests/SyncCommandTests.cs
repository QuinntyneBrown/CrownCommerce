using System.CommandLine;
using CrownCommerce.Cli.Sync.Commands;
using CrownCommerce.Cli.Sync.Services;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Sync.Tests;

public class SyncCommandTests
{
    private readonly ISyncService _syncService;

    public SyncCommandTests()
    {
        _syncService = Substitute.For<ISyncService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_syncService);
        return SyncCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Now_Command_Returns_Zero_And_Calls_ShowTeamStatusAsync()
    {
        _syncService.ShowTeamStatusAsync().Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["now"]);

        Assert.Equal(0, exitCode);
        await _syncService.Received(1).ShowTeamStatusAsync();
    }

    [Fact]
    public async Task Handoff_Command_Calls_CreateHandoffAsync()
    {
        _syncService.CreateHandoffAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["handoff", "--to", "Quinn", "--message", "Please review PR"]);

        Assert.Equal(0, exitCode);
        await _syncService.Received(1).CreateHandoffAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task Inbox_Command_Calls_GetInboxAsync()
    {
        _syncService.GetInboxAsync().Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["inbox"]);

        Assert.Equal(0, exitCode);
        await _syncService.Received(1).GetInboxAsync();
    }

    [Fact]
    public async Task Overlap_Command_With_Members_Calls_FindOverlapAsync()
    {
        _syncService.FindOverlapAsync(Arg.Any<string[]>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["overlap", "Quinn", "James"]);

        Assert.Equal(0, exitCode);
        await _syncService.Received(1).FindOverlapAsync(Arg.Any<string[]>());
    }

    [Fact]
    public async Task Focus_Command_Calls_StartFocusAsync()
    {
        _syncService.StartFocusAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["focus", "--duration", "2h", "--message", "Deep work"]);

        Assert.Equal(0, exitCode);
        await _syncService.Received(1).StartFocusAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task Handoff_Command_Passes_Correct_To_And_Message_Values()
    {
        _syncService.CreateHandoffAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        await rootCommand.InvokeAsync(["handoff", "--to", "Amara", "--message", "Deploy is ready"]);

        await _syncService.Received(1).CreateHandoffAsync("Amara", "Deploy is ready");
    }

    [Fact]
    public async Task Focus_Command_Passes_Correct_Duration_And_Message()
    {
        _syncService.StartFocusAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        await rootCommand.InvokeAsync(["focus", "--duration", "30m", "--message", "Code review"]);

        await _syncService.Received(1).StartFocusAsync("30m", "Code review");
    }
}

public class SyncServiceTests
{
    private readonly IHandoffStore _store;
    private readonly ITeamDirectory _directory;
    private readonly SyncService _service;

    public SyncServiceTests()
    {
        _store = Substitute.For<IHandoffStore>();
        _directory = Substitute.For<ITeamDirectory>();
        var logger = new Microsoft.Extensions.Logging.Abstractions.NullLogger<SyncService>();
        _service = new SyncService(logger, _store, _directory);
    }

    [Fact]
    public async Task ShowTeamStatusAsync_Gets_Members_From_Directory()
    {
        var members = new List<TeamMember>
        {
            new("Quinn", "America/Toronto", "Eastern Standard Time"),
        };
        _directory.GetMembersAsync().Returns(members.AsReadOnly());
        _store.GetActiveFocusAsync(Arg.Any<string>()).Returns((FocusSession?)null);

        await _service.ShowTeamStatusAsync();

        await _directory.Received(1).GetMembersAsync();
    }

    [Fact]
    public async Task CreateHandoffAsync_Stores_A_Handoff_Note()
    {
        var member = new TeamMember("Amara", "Africa/Lagos", "W. Africa Standard Time");
        _directory.GetMemberAsync("Amara").Returns(member);

        await _service.CreateHandoffAsync("Amara", "Please review PR #42");

        await _store.Received(1).AddNoteAsync(Arg.Is<HandoffNote>(n =>
            n.To == "Amara" &&
            n.Message == "Please review PR #42" &&
            !n.Read));
    }

    [Fact]
    public async Task CreateHandoffAsync_Validates_Recipient_Exists_In_Directory()
    {
        _directory.GetMemberAsync("NonExistent").Returns((TeamMember?)null);

        await _service.CreateHandoffAsync("NonExistent", "Hello");

        await _store.DidNotReceive().AddNoteAsync(Arg.Any<HandoffNote>());
    }

    [Fact]
    public async Task GetInboxAsync_Retrieves_Pending_Notes()
    {
        var notes = new List<HandoffNote>
        {
            new("1", "Amara", Environment.UserName, "Check the logs", DateTime.UtcNow, false),
        };
        _store.GetPendingNotesAsync(Environment.UserName).Returns(notes.AsReadOnly());

        await _service.GetInboxAsync();

        await _store.Received(1).GetPendingNotesAsync(Environment.UserName);
        await _store.Received(1).MarkReadAsync("1");
    }

    [Fact]
    public async Task FindOverlapAsync_Calculates_Overlap_For_Matching_Members()
    {
        var members = new List<TeamMember>
        {
            new("Quinn", "America/Toronto", "Eastern Standard Time"),
            new("James", "Europe/London", "GMT Standard Time"),
        };
        _directory.GetMembersAsync().Returns(members.AsReadOnly());

        await _service.FindOverlapAsync(["Quinn", "James"]);

        await _directory.Received(1).GetMembersAsync();
    }

    [Fact]
    public async Task FindOverlapAsync_Handles_No_Matching_Members()
    {
        var members = new List<TeamMember>();
        _directory.GetMembersAsync().Returns(members.AsReadOnly());

        await _service.FindOverlapAsync(["Nobody"]);

        await _directory.Received(1).GetMembersAsync();
    }

    [Fact]
    public async Task StartFocusAsync_Stores_A_Focus_Session_With_Correct_End_Time()
    {
        await _service.StartFocusAsync("2h", "Deep work");

        await _store.Received(1).SetFocusAsync(Arg.Is<FocusSession>(s =>
            s.Message == "Deep work" &&
            s.EndsAt > s.StartsAt &&
            (s.EndsAt - s.StartsAt).TotalMinutes >= 119 &&
            (s.EndsAt - s.StartsAt).TotalMinutes <= 121));
    }

    [Fact]
    public void ParseDuration_Parses_2h_Correctly()
    {
        var result = SyncService.ParseDuration("2h");
        Assert.Equal(120, result);
    }

    [Fact]
    public void ParseDuration_Parses_30m_Correctly()
    {
        var result = SyncService.ParseDuration("30m");
        Assert.Equal(30, result);
    }
}
