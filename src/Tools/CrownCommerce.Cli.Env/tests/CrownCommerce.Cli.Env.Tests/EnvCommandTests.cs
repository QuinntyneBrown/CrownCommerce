using System.CommandLine;
using CrownCommerce.Cli.Env.Commands;
using CrownCommerce.Cli.Env.Services;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Env.Tests;

public class EnvCommandTests
{
    private readonly IEnvironmentService _envService;

    public EnvCommandTests()
    {
        _envService = Substitute.For<IEnvironmentService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_envService);
        return EnvCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Ports_Command_Returns_Zero_And_Calls_ListPortsAsync()
    {
        _envService.ListPortsAsync().Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["ports"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).ListPortsAsync();
    }

    [Fact]
    public async Task Health_Command_Returns_Zero_And_Calls_CheckHealthAsync_With_Default_Env()
    {
        _envService.CheckHealthAsync(Arg.Any<string>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["health"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).CheckHealthAsync("development");
    }

    [Fact]
    public async Task Health_Command_With_Env_Option_Passes_Correct_Environment()
    {
        _envService.CheckHealthAsync(Arg.Any<string>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["health", "--env", "staging"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).CheckHealthAsync("staging");
    }

    [Fact]
    public async Task Databases_Command_Returns_Zero_And_Calls_ListDatabasesAsync()
    {
        _envService.ListDatabasesAsync().Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["databases"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).ListDatabasesAsync();
    }

    [Fact]
    public async Task Up_Command_Returns_Zero_And_Calls_StartAsync()
    {
        _envService.StartAsync(Arg.Any<string[]?>(), Arg.Any<string[]?>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["up"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).StartAsync(null, null);
    }

    [Fact]
    public async Task Up_Command_With_Services_Filter_Passes_Correct_Values()
    {
        _envService.StartAsync(Arg.Any<string[]?>(), Arg.Any<string[]?>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["up", "--services", "catalog,identity"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).StartAsync(
            Arg.Is<string[]?>(arr => arr != null && arr.Length == 2 && arr[0] == "catalog" && arr[1] == "identity"),
            Arg.Is<string[]?>(arr => arr == null));
    }

    [Fact]
    public async Task Up_Command_With_Frontends_Filter_Passes_Correct_Values()
    {
        _envService.StartAsync(Arg.Any<string[]?>(), Arg.Any<string[]?>()).Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["up", "--frontends", "admin,teams"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).StartAsync(
            Arg.Is<string[]?>(arr => arr == null),
            Arg.Is<string[]?>(arr => arr != null && arr.Length == 2 && arr[0] == "admin" && arr[1] == "teams"));
    }

    [Fact]
    public async Task Down_Command_Returns_Zero_And_Calls_StopAsync()
    {
        _envService.StopAsync().Returns(Task.CompletedTask);
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["down"]);

        Assert.Equal(0, exitCode);
        await _envService.Received(1).StopAsync();
    }
}

public class EnvironmentServiceTests
{
    private readonly IHealthChecker _healthChecker;
    private readonly IProcessManager _processManager;
    private readonly EnvironmentService _service;

    public EnvironmentServiceTests()
    {
        _healthChecker = Substitute.For<IHealthChecker>();
        _processManager = Substitute.For<IProcessManager>();
        var logger = new Microsoft.Extensions.Logging.Abstractions.NullLogger<EnvironmentService>();
        _service = new EnvironmentService(logger, _healthChecker, _processManager);
    }

    [Fact]
    public async Task CheckHealthAsync_Calls_HealthChecker_For_Each_PortMap_Entry()
    {
        _healthChecker.CheckAsync(Arg.Any<string>(), Arg.Any<int>())
            .Returns(callInfo => new HealthCheckResult(
                callInfo.ArgAt<string>(0),
                callInfo.ArgAt<int>(1),
                IsHealthy: true));

        await _service.CheckHealthAsync("development");

        foreach (var entry in EnvironmentService.PortMap)
        {
            await _healthChecker.Received(1).CheckAsync(entry.Name, entry.Port);
        }
    }

    [Fact]
    public async Task ListDatabasesAsync_Returns_Correct_Database_Names_For_Services_Only()
    {
        // Capture console output
        var writer = new StringWriter();
        Console.SetOut(writer);

        await _service.ListDatabasesAsync();

        var output = writer.ToString();

        // Should contain service database names
        Assert.Contains("CrownCommerce_Catalog", output);
        Assert.Contains("CrownCommerce_Content", output);
        Assert.Contains("CrownCommerce_Identity", output);
        Assert.Contains("CrownCommerce_Order", output);
        Assert.Contains("CrownCommerce_Payment", output);
        Assert.Contains("CrownCommerce_Chat", output);
        Assert.Contains("CrownCommerce_Crm", output);
        Assert.Contains("CrownCommerce_Scheduling", output);

        // Should NOT contain frontend or infrastructure entries
        Assert.DoesNotContain("CrownCommerce_Admin", output);
        Assert.DoesNotContain("CrownCommerce_Teams", output);
        Assert.DoesNotContain("CrownCommerce_ApiGateway", output);
        Assert.DoesNotContain("CrownCommerce_Rabbitmq", output);

        // Restore console
        Console.SetOut(new StreamWriter(Console.OpenStandardOutput()) { AutoFlush = true });
    }

    [Fact]
    public async Task ListPortsAsync_Returns_All_19_Port_Entries()
    {
        var writer = new StringWriter();
        Console.SetOut(writer);

        await _service.ListPortsAsync();

        var output = writer.ToString();

        foreach (var entry in EnvironmentService.PortMap)
        {
            Assert.Contains(entry.Name, output);
            Assert.Contains(entry.Port.ToString(), output);
        }

        Assert.Equal(19, EnvironmentService.PortMap.Count);

        Console.SetOut(new StreamWriter(Console.OpenStandardOutput()) { AutoFlush = true });
    }

    [Fact]
    public async Task StartAsync_With_Service_Filter_Only_Starts_Matching_Services()
    {
        _processManager.StartAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>())
            .Returns(true);

        await _service.StartAsync(new[] { "catalog", "identity" }, null);

        await _processManager.Received(1).StartAsync("catalog", Arg.Any<string>(), Arg.Any<string>());
        await _processManager.Received(1).StartAsync("identity", Arg.Any<string>(), Arg.Any<string>());
        await _processManager.DidNotReceive().StartAsync("order", Arg.Any<string>(), Arg.Any<string>());
        await _processManager.DidNotReceive().StartAsync("admin", Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task StartAsync_With_Null_Filters_Starts_Everything()
    {
        _processManager.StartAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>())
            .Returns(true);

        await _service.StartAsync(null, null);

        foreach (var entry in EnvironmentService.PortMap)
        {
            await _processManager.Received(1).StartAsync(entry.Name, Arg.Any<string>(), Arg.Any<string>());
        }
    }

    [Fact]
    public async Task StopAsync_Calls_ProcessManager_StopAllAsync()
    {
        _processManager.StopAllAsync().Returns(Task.CompletedTask);

        await _service.StopAsync();

        await _processManager.Received(1).StopAllAsync();
    }

    [Fact]
    public async Task CheckHealthAsync_Handles_Unhealthy_Services_Gracefully()
    {
        _healthChecker.CheckAsync(Arg.Any<string>(), Arg.Any<int>())
            .Returns(callInfo => new HealthCheckResult(
                callInfo.ArgAt<string>(0),
                callInfo.ArgAt<int>(1),
                IsHealthy: false,
                Error: "Connection refused"));

        // Should not throw
        var exception = await Record.ExceptionAsync(() => _service.CheckHealthAsync("development"));

        Assert.Null(exception);
    }
}
