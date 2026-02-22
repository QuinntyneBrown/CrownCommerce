using System.CommandLine;
using CrownCommerce.Cli.Logs.Commands;
using CrownCommerce.Cli.Logs.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Logs.Tests;

public class LogsCommandTests
{
    private readonly ILogService _logService;

    public LogsCommandTests()
    {
        _logService = Substitute.For<ILogService>();
        _logService.TailLogsAsync(
            Arg.Any<string[]?>(),
            Arg.Any<string?>(),
            Arg.Any<string?>(),
            Arg.Any<string?>(),
            Arg.Any<string?>())
            .Returns(Task.CompletedTask);
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_logService);
        return LogsCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Default_Invocation_Calls_TailLogsAsync_With_Null_Services()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync([]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            null,
            null,
            null,
            null,
            null);
    }

    [Fact]
    public async Task Service_Option_Passes_Correct_Service_Filter()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync(["--service", "catalog"]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            Arg.Is<string[]?>(s => s != null && s.Length == 1 && s[0] == "catalog"),
            null,
            null,
            null,
            null);
    }

    [Fact]
    public async Task Multiple_Service_Options_Pass_Multiple_Services()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync(["--service", "catalog", "--service", "identity"]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            Arg.Is<string[]?>(s => s != null && s.Length == 2 && s[0] == "catalog" && s[1] == "identity"),
            null,
            null,
            null,
            null);
    }

    [Fact]
    public async Task Level_Option_Passes_Level_Filter()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync(["--level", "error"]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            null,
            "error",
            null,
            null,
            null);
    }

    [Fact]
    public async Task Search_Option_Passes_Search_Filter()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync(["--search", "timeout"]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            null,
            null,
            "timeout",
            null,
            null);
    }

    [Fact]
    public async Task Since_Option_Passes_Since_Filter()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync(["--since", "1h"]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            null,
            null,
            null,
            "1h",
            null);
    }

    [Fact]
    public async Task Output_Option_Passes_Output_Path()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync(["--output", "/tmp/out.log"]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            null,
            null,
            null,
            null,
            "/tmp/out.log");
    }

    [Fact]
    public async Task All_Options_Combined_Pass_All_Values_Correctly()
    {
        var command = CreateCommand();

        var exitCode = await command.InvokeAsync([
            "--service", "catalog",
            "--service", "order",
            "--level", "warning",
            "--search", "connection",
            "--since", "30m",
            "--output", "/tmp/combined.log"
        ]);

        Assert.Equal(0, exitCode);
        await _logService.Received(1).TailLogsAsync(
            Arg.Is<string[]?>(s => s != null && s.Length == 2 && s[0] == "catalog" && s[1] == "order"),
            "warning",
            "connection",
            "30m",
            "/tmp/combined.log");
    }
}

public class LogServiceTests
{
    private readonly ILogSource _logSource;
    private readonly LogService _service;

    public LogServiceTests()
    {
        _logSource = Substitute.For<ILogSource>();
        var logger = NullLogger<LogService>.Instance;
        _service = new LogService(logger, _logSource);
    }

    [Fact]
    public async Task TailLogsAsync_With_Null_Services_Queries_All_Known_Services()
    {
        _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
            .Returns(Task.FromResult<IReadOnlyList<LogEntry>>([]));

        await _service.TailLogsAsync(null, null, null, null, null);

        await _logSource.Received(1).ReadLogsAsync(
            Arg.Is<string[]>(s => s.Length == LogService.AllServices.Length),
            null);
    }

    [Fact]
    public async Task TailLogsAsync_With_Specific_Services_Queries_Only_Those()
    {
        var services = new[] { "catalog", "order" };
        _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
            .Returns(Task.FromResult<IReadOnlyList<LogEntry>>([]));

        await _service.TailLogsAsync(services, null, null, null, null);

        await _logSource.Received(1).ReadLogsAsync(
            Arg.Is<string[]>(s => s.Length == 2 && s[0] == "catalog" && s[1] == "order"),
            null);
    }

    [Fact]
    public void TailLogsAsync_With_Level_Filter_Only_Returns_Matching_Entries()
    {
        var entries = new List<LogEntry>
        {
            new(DateTime.UtcNow, "Error", "catalog", "Something failed"),
            new(DateTime.UtcNow, "Info", "catalog", "Request completed"),
            new(DateTime.UtcNow, "error", "order", "Another failure"),
        };
        _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
            .Returns(Task.FromResult<IReadOnlyList<LogEntry>>(entries));

        var output = CaptureConsoleOutput(() =>
            _service.TailLogsAsync(null, "error", null, null, null));

        Assert.Contains("Something failed", output);
        Assert.Contains("Another failure", output);
        Assert.DoesNotContain("Request completed", output);
    }

    [Fact]
    public void TailLogsAsync_With_Search_Filter_Only_Returns_Matching_Entries()
    {
        var entries = new List<LogEntry>
        {
            new(DateTime.UtcNow, "Error", "catalog", "Connection timeout occurred"),
            new(DateTime.UtcNow, "Error", "catalog", "Disk space low"),
        };
        _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
            .Returns(Task.FromResult<IReadOnlyList<LogEntry>>(entries));

        var output = CaptureConsoleOutput(() =>
            _service.TailLogsAsync(null, null, "timeout", null, null));

        Assert.Contains("timeout", output);
        Assert.DoesNotContain("Disk space", output);
    }

    [Fact]
    public async Task TailLogsAsync_With_Since_Filter_Passes_To_LogSource()
    {
        _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
            .Returns(Task.FromResult<IReadOnlyList<LogEntry>>([]));

        await _service.TailLogsAsync(null, null, null, "2h", null);

        await _logSource.Received(1).ReadLogsAsync(
            Arg.Any<string[]>(),
            "2h");
    }

    [Fact]
    public async Task TailLogsAsync_With_Output_Writes_To_File()
    {
        var tempFile = Path.Combine(Path.GetTempPath(), $"logs-test-{Guid.NewGuid()}.log");

        try
        {
            var entries = new List<LogEntry>
            {
                new(new DateTime(2026, 2, 21, 10, 30, 0), "Error", "catalog", "Test error message"),
            };
            _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
                .Returns(Task.FromResult<IReadOnlyList<LogEntry>>(entries));

            await _service.TailLogsAsync(null, null, null, null, tempFile);

            Assert.True(File.Exists(tempFile));
            var content = await File.ReadAllTextAsync(tempFile);
            Assert.Contains("Test error message", content);
            Assert.Contains("[Error]", content);
            Assert.Contains("[catalog]", content);
        }
        finally
        {
            if (File.Exists(tempFile))
            {
                File.Delete(tempFile);
            }
        }
    }

    [Fact]
    public void TailLogsAsync_With_No_Matching_Logs_Returns_Gracefully()
    {
        _logSource.ReadLogsAsync(Arg.Any<string[]>(), Arg.Any<string?>())
            .Returns(Task.FromResult<IReadOnlyList<LogEntry>>([]));

        var output = CaptureConsoleOutput(() =>
            _service.TailLogsAsync(null, null, null, null, null));

        Assert.Contains("No log entries found", output);
    }

    private static string CaptureConsoleOutput(Func<Task> action)
    {
        var originalOut = Console.Out;
        using var writer = new StringWriter();
        Console.SetOut(writer);

        try
        {
            action().GetAwaiter().GetResult();
            return writer.ToString();
        }
        finally
        {
            Console.SetOut(originalOut);
        }
    }
}
