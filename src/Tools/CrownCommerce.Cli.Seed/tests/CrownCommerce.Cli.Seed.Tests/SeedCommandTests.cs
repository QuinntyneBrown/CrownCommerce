using System.CommandLine;
using CrownCommerce.Cli.Seed.Commands;
using CrownCommerce.Cli.Seed.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Seed.Tests;

public class SeedCommandTests
{
    private readonly ISeedService _seedService;

    public SeedCommandTests()
    {
        _seedService = Substitute.For<ISeedService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_seedService);
        return SeedCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Seed_Catalog_With_Profile_Demo_Returns_Zero_And_Calls_SeedAsync()
    {
        _seedService.SeedAsync("catalog", "demo", false, false).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["catalog", "--profile", "demo"]);

        Assert.Equal(0, exitCode);
        await _seedService.Received(1).SeedAsync("catalog", "demo", false, false);
    }

    [Fact]
    public async Task Seed_All_Calls_SeedAsync_With_All()
    {
        _seedService.SeedAsync("all", "demo", false, false).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["all"]);

        Assert.Equal(0, exitCode);
        await _seedService.Received(1).SeedAsync("all", "demo", false, false);
    }

    [Fact]
    public async Task Reset_Flag_Passes_True()
    {
        _seedService.SeedAsync("catalog", "demo", true, false).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["catalog", "--reset"]);

        Assert.Equal(0, exitCode);
        await _seedService.Received(1).SeedAsync("catalog", "demo", true, false);
    }

    [Fact]
    public async Task DryRun_Flag_Passes_True()
    {
        _seedService.SeedAsync("catalog", "demo", false, true).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["catalog", "--dry-run"]);

        Assert.Equal(0, exitCode);
        await _seedService.Received(1).SeedAsync("catalog", "demo", false, true);
    }

    [Fact]
    public async Task Default_Profile_Is_Demo()
    {
        _seedService.SeedAsync("identity", "demo", false, false).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["identity"]);

        Assert.Equal(0, exitCode);
        await _seedService.Received(1).SeedAsync("identity", "demo", false, false);
    }

    [Fact]
    public async Task Combination_Of_Reset_And_DryRun_Works()
    {
        _seedService.SeedAsync("catalog", "e2e", true, true).Returns(Task.CompletedTask);

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["catalog", "--profile", "e2e", "--reset", "--dry-run"]);

        Assert.Equal(0, exitCode);
        await _seedService.Received(1).SeedAsync("catalog", "e2e", true, true);
    }
}

public class SeedServiceTests
{
    private readonly ISeederRunner _runner;
    private readonly SeedService _service;

    public SeedServiceTests()
    {
        _runner = Substitute.For<ISeederRunner>();
        var logger = NullLoggerFactory.Instance.CreateLogger<SeedService>();
        _service = new SeedService(logger, _runner);
    }

    [Fact]
    public async Task SeedAsync_With_Valid_Service_Calls_Runner()
    {
        _runner.RunSeedAsync("catalog", "demo", false)
            .Returns(new SeedResult("catalog", "demo", true, 50));

        await _service.SeedAsync("catalog", "demo", false, false);

        await _runner.Received(1).RunSeedAsync("catalog", "demo", false);
    }

    [Fact]
    public async Task SeedAsync_With_All_Calls_Runner_For_Each_Service()
    {
        foreach (var svc in SeedService.ServicesWithSeeders)
        {
            _runner.RunSeedAsync(svc, "demo", false)
                .Returns(new SeedResult(svc, "demo", true, 10));
        }

        await _service.SeedAsync("all", "demo", false, false);

        foreach (var svc in SeedService.ServicesWithSeeders)
        {
            await _runner.Received(1).RunSeedAsync(svc, "demo", false);
        }
    }

    [Fact]
    public async Task SeedAsync_With_DryRun_Does_Not_Call_Runner()
    {
        await _service.SeedAsync("catalog", "demo", false, true);

        await _runner.DidNotReceiveWithAnyArgs().RunSeedAsync(default!, default!, default);
    }

    [Fact]
    public async Task SeedAsync_With_Invalid_Profile_Does_Not_Call_Runner()
    {
        await _service.SeedAsync("catalog", "nonexistent", false, false);

        await _runner.DidNotReceiveWithAnyArgs().RunSeedAsync(default!, default!, default);
    }

    [Fact]
    public async Task SeedAsync_With_Unknown_Service_Does_Not_Call_Runner()
    {
        await _service.SeedAsync("unknown-service", "demo", false, false);

        await _runner.DidNotReceiveWithAnyArgs().RunSeedAsync(default!, default!, default);
    }

    [Fact]
    public async Task SeedAsync_With_Reset_Passes_Reset_True_To_Runner()
    {
        _runner.RunSeedAsync("catalog", "demo", true)
            .Returns(new SeedResult("catalog", "demo", true, 25));

        await _service.SeedAsync("catalog", "demo", true, false);

        await _runner.Received(1).RunSeedAsync("catalog", "demo", true);
    }

    [Fact]
    public async Task SeedAsync_Collects_Results_From_All_Services()
    {
        foreach (var svc in SeedService.ServicesWithSeeders)
        {
            _runner.RunSeedAsync(svc, "minimal", false)
                .Returns(new SeedResult(svc, "minimal", true, 5));
        }

        await _service.SeedAsync("all", "minimal", false, false);

        var totalCalls = SeedService.ServicesWithSeeders.Length;
        Assert.Equal(totalCalls, _runner.ReceivedCalls().Count());
    }
}
