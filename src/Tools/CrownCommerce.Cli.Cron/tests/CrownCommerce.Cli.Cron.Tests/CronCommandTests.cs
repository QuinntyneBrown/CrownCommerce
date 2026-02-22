using System.CommandLine;
using CrownCommerce.Cli.Cron.Commands;
using CrownCommerce.Cli.Cron.Services;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Cron.Tests;

public class CronCommandTests
{
    private readonly ICronService _cronService;

    public CronCommandTests()
    {
        _cronService = Substitute.For<ICronService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_cronService);
        var sp = services.BuildServiceProvider();
        return CronCommand.Create(sp);
    }

    [Fact]
    public async Task List_ReturnsZero_AndCallsListJobsAsync()
    {
        _cronService.ListJobsAsync().Returns(new List<CronJobDefinition>
        {
            new("test-job", "*/5 * * * *", "test", "A test job"),
        });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["list"]);

        Assert.Equal(0, exitCode);
        await _cronService.Received(1).ListJobsAsync();
    }

    [Fact]
    public async Task List_DisplaysJobData()
    {
        _cronService.ListJobsAsync().Returns(new List<CronJobDefinition>
        {
            new("clear-carts", "*/30 * * * *", "order", "Remove expired carts"),
            new("send-reminders", "0 9 * * *", "crm", "Email reminders"),
        });

        var output = new StringWriter();
        Console.SetOut(output);

        var command = CreateCommand();
        await command.InvokeAsync(["list"]);

        var text = output.ToString();
        Assert.Contains("clear-carts", text);
        Assert.Contains("send-reminders", text);
        Assert.Contains("order", text);
        Assert.Contains("crm", text);

        Console.SetOut(new StreamWriter(Console.OpenStandardOutput()) { AutoFlush = true });
    }

    [Fact]
    public async Task Run_WithValidJob_ReturnsZero()
    {
        _cronService.RunJobAsync("my-job").Returns(true);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["run", "my-job"]);

        Assert.Equal(0, exitCode);
        await _cronService.Received(1).RunJobAsync("my-job");
    }

    [Fact]
    public async Task Run_WithInvalidJob_ReturnsOne()
    {
        _cronService.RunJobAsync("unknown-job").Returns(false);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["run", "unknown-job"]);

        Assert.Equal(1, exitCode);
        await _cronService.Received(1).RunJobAsync("unknown-job");
    }

    [Fact]
    public async Task Start_ReturnsZero_AndCallsStartDaemonAsync()
    {
        _cronService.StartDaemonAsync(null).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["start"]);

        Assert.Equal(0, exitCode);
        await _cronService.Received(1).StartDaemonAsync(null);
    }

    [Fact]
    public async Task Start_WithJobFilter_PassesCorrectValue()
    {
        _cronService.StartDaemonAsync("my-job").Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["start", "--job", "my-job"]);

        Assert.Equal(0, exitCode);
        await _cronService.Received(1).StartDaemonAsync("my-job");
    }

    [Fact]
    public async Task History_WithNoArgs_ReturnsZero_AndCallsGetHistoryAsyncWithNull()
    {
        _cronService.GetHistoryAsync(null).Returns(new List<CronJobHistory>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["history"]);

        Assert.Equal(0, exitCode);
        await _cronService.Received(1).GetHistoryAsync(null);
    }

    [Fact]
    public async Task History_WithJobName_PassesCorrectValue()
    {
        _cronService.GetHistoryAsync("my-job").Returns(new List<CronJobHistory>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["history", "my-job"]);

        Assert.Equal(0, exitCode);
        await _cronService.Received(1).GetHistoryAsync("my-job");
    }

    [Fact]
    public async Task History_DisplaysEntries()
    {
        var executedAt = new DateTime(2026, 1, 15, 10, 30, 0, DateTimeKind.Utc);
        _cronService.GetHistoryAsync(null).Returns(new List<CronJobHistory>
        {
            new("clear-carts", executedAt, "Success"),
            new("send-reminders", executedAt, "Failed", "Connection refused"),
        });

        var output = new StringWriter();
        Console.SetOut(output);

        var command = CreateCommand();
        await command.InvokeAsync(["history"]);

        var text = output.ToString();
        Assert.Contains("clear-carts", text);
        Assert.Contains("send-reminders", text);
        Assert.Contains("Success", text);
        Assert.Contains("Failed", text);
        Assert.Contains("Connection refused", text);

        Console.SetOut(new StreamWriter(Console.OpenStandardOutput()) { AutoFlush = true });
    }
}
