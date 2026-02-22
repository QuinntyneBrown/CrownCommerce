using System.CommandLine;
using CrownCommerce.Cli.Schedule.Commands;
using CrownCommerce.Cli.Schedule.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Schedule.Tests;

public class ScheduleCommandTests
{
    private readonly IScheduleService _scheduleService;

    public ScheduleCommandTests()
    {
        _scheduleService = Substitute.For<IScheduleService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_scheduleService);
        return ScheduleCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Meetings_ReturnsZero_AndCallsListMeetingsAsync()
    {
        _scheduleService.ListMeetingsAsync(false, null)
            .Returns(new List<Meeting>
            {
                new("Sprint Planning", DateTime.UtcNow.Date.AddHours(10), "1h",
                    ["quinn@crowncommerce.io"], "Zoom"),
            });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["meetings"]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).ListMeetingsAsync(false, null);
    }

    [Fact]
    public async Task Meetings_WithWeekFlag_PassesTrue()
    {
        _scheduleService.ListMeetingsAsync(true, null)
            .Returns(new List<Meeting>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["meetings", "--week"]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).ListMeetingsAsync(true, null);
    }

    [Fact]
    public async Task Meetings_WithForEmail_PassesCorrectFilter()
    {
        var email = "quinn@crowncommerce.io";
        _scheduleService.ListMeetingsAsync(false, email)
            .Returns(new List<Meeting>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["meetings", "--for", email]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).ListMeetingsAsync(false, email);
    }

    [Fact]
    public async Task CreateMeeting_WithRequiredOptions_CallsCreateMeetingAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync([
            "create-meeting",
            "--title", "Standup",
            "--start", "2025-03-15T10:00:00Z",
            "--attendees", "quinn@crowncommerce.io",
        ]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).CreateMeetingAsync(Arg.Is<CreateMeetingRequest>(r =>
            r.Title == "Standup" &&
            r.Start == "2025-03-15T10:00:00Z" &&
            r.Attendees.Count == 1 &&
            r.Attendees[0] == "quinn@crowncommerce.io"));
    }

    [Fact]
    public async Task CreateMeeting_PassesCorrectAttendeesList()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync([
            "create-meeting",
            "--title", "Team Sync",
            "--start", "2025-03-15T14:00:00Z",
            "--attendees", "quinn@crowncommerce.io, amara@crowncommerce.io, sophia@crowncommerce.io",
        ]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).CreateMeetingAsync(Arg.Is<CreateMeetingRequest>(r =>
            r.Attendees.Count == 3 &&
            r.Attendees[0] == "quinn@crowncommerce.io" &&
            r.Attendees[1] == "amara@crowncommerce.io" &&
            r.Attendees[2] == "sophia@crowncommerce.io"));
    }

    [Fact]
    public async Task Channels_ReturnsZero()
    {
        _scheduleService.ListChannelsAsync(null)
            .Returns(new List<Channel>
            {
                new("general", "public", 5),
            });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["channels"]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).ListChannelsAsync(null);
    }

    [Fact]
    public async Task Channels_WithTypePublic_PassesFilter()
    {
        _scheduleService.ListChannelsAsync("public")
            .Returns(new List<Channel>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["channels", "--type", "public"]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).ListChannelsAsync("public");
    }

    [Fact]
    public async Task Availability_WithDate_CallsGetAvailabilityAsync()
    {
        _scheduleService.GetAvailabilityAsync("2025-03-15")
            .Returns(new List<Availability>
            {
                new("quinn@crowncommerce.io", "Quinn Brown", "America/Toronto", ["09:00-10:00"]),
            });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["availability", "--date", "2025-03-15"]);

        Assert.Equal(0, exitCode);
        await _scheduleService.Received(1).GetAvailabilityAsync("2025-03-15");
    }
}

public class ScheduleServiceTests
{
    private readonly IScheduleStore _store;
    private readonly ScheduleService _service;

    public ScheduleServiceTests()
    {
        _store = Substitute.For<IScheduleStore>();
        var logger = new LoggerFactory().CreateLogger<ScheduleService>();
        _service = new ScheduleService(logger, _store);
    }

    [Fact]
    public async Task ListMeetingsAsync_DelegatesToStore_WithCorrectParams()
    {
        var expected = new List<Meeting>
        {
            new("Standup", DateTime.UtcNow.Date.AddHours(9), "30m", ["quinn@crowncommerce.io"], "Zoom"),
        };
        _store.GetMeetingsAsync(true, "quinn@crowncommerce.io").Returns(expected);

        var result = await _service.ListMeetingsAsync(true, "quinn@crowncommerce.io");

        Assert.Same(expected, result);
        await _store.Received(1).GetMeetingsAsync(true, "quinn@crowncommerce.io");
    }

    [Fact]
    public async Task CreateMeetingAsync_ParsesRequest_AndAddsMeetingToStore()
    {
        var request = new CreateMeetingRequest(
            Title: "Sprint Review",
            Start: "2025-03-15T10:00:00Z",
            Duration: "1h",
            Attendees: ["quinn@crowncommerce.io", "amara@crowncommerce.io"],
            Location: "Zoom");

        await _service.CreateMeetingAsync(request);

        await _store.Received(1).AddMeetingAsync(Arg.Is<Meeting>(m =>
            m.Title == "Sprint Review" &&
            m.Duration == "1h" &&
            m.Attendees.Count == 2 &&
            m.Location == "Zoom"));
    }

    [Fact]
    public async Task CreateMeetingAsync_UsesDefaultDuration_WhenNotSpecified()
    {
        var request = new CreateMeetingRequest(
            Title: "Quick Chat",
            Start: "2025-03-15T10:00:00Z",
            Duration: null!,
            Attendees: ["quinn@crowncommerce.io"],
            Location: null);

        await _service.CreateMeetingAsync(request);

        await _store.Received(1).AddMeetingAsync(Arg.Is<Meeting>(m =>
            m.Duration == "1h"));
    }

    [Fact]
    public async Task ListChannelsAsync_DelegatesToStore()
    {
        var expected = new List<Channel> { new("general", "public", 5) };
        _store.GetChannelsAsync("public").Returns(expected);

        var result = await _service.ListChannelsAsync("public");

        Assert.Same(expected, result);
        await _store.Received(1).GetChannelsAsync("public");
    }

    [Fact]
    public async Task GetAvailabilityAsync_DelegatesToStore()
    {
        var expected = new List<Availability>
        {
            new("quinn@crowncommerce.io", "Quinn Brown", "America/Toronto", ["09:00-10:00"]),
        };
        _store.GetAvailabilityAsync("2025-03-15").Returns(expected);

        var result = await _service.GetAvailabilityAsync("2025-03-15");

        Assert.Same(expected, result);
        await _store.Received(1).GetAvailabilityAsync("2025-03-15");
    }

    [Fact]
    public async Task ListMeetingsAsync_ReturnsEmptyList_FromEmptyStore()
    {
        _store.GetMeetingsAsync(false, null).Returns(new List<Meeting>());

        var result = await _service.ListMeetingsAsync(false, null);

        Assert.Empty(result);
        await _store.Received(1).GetMeetingsAsync(false, null);
    }
}
