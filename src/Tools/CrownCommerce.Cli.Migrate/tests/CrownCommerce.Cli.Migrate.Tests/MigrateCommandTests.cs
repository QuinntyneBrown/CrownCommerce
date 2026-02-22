using System.CommandLine;
using CrownCommerce.Cli.Migrate.Commands;
using CrownCommerce.Cli.Migrate.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Migrate.Tests;

public class MigrateCommandTests
{
    private readonly IMigrationService _migrationService;

    public MigrateCommandTests()
    {
        _migrationService = Substitute.For<IMigrationService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_migrationService);
        return MigrateCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Status_Command_Returns_Zero_And_Calls_GetStatusAsync_With_Default_Env()
    {
        _migrationService.GetStatusAsync(Arg.Any<string>())
            .Returns(new List<MigrationStatus>
            {
                new("catalog", 5, 0),
                new("identity", 3, 1),
            });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["status"]);

        Assert.Equal(0, exitCode);
        await _migrationService.Received(1).GetStatusAsync("development");
    }

    [Fact]
    public async Task Status_Command_With_Env_Passes_Correct_Env()
    {
        _migrationService.GetStatusAsync(Arg.Any<string>())
            .Returns(new List<MigrationStatus>());

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["status", "--env", "staging"]);

        Assert.Equal(0, exitCode);
        await _migrationService.Received(1).GetStatusAsync("staging");
    }

    [Fact]
    public async Task Add_Command_With_Service_And_Name_Calls_AddMigrationAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["add", "catalog", "InitialCreate"]);

        Assert.Equal(0, exitCode);
        await _migrationService.Received(1).AddMigrationAsync("catalog", "InitialCreate");
    }

    [Fact]
    public async Task Apply_Command_With_Service_Calls_ApplyMigrationsAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["apply", "catalog"]);

        Assert.Equal(0, exitCode);
        await _migrationService.Received(1).ApplyMigrationsAsync("catalog", "development");
    }

    [Fact]
    public async Task Apply_Command_With_Env_Passes_Correct_Env()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["apply", "identity", "--env", "production"]);

        Assert.Equal(0, exitCode);
        await _migrationService.Received(1).ApplyMigrationsAsync("identity", "production");
    }
}

public class MigrationServiceTests
{
    private readonly IProcessRunner _processRunner;
    private readonly MigrationService _service;

    public MigrationServiceTests()
    {
        _processRunner = Substitute.For<IProcessRunner>();
        var logger = NullLoggerFactory.Instance.CreateLogger<MigrationService>();
        _service = new MigrationService(logger, _processRunner);
    }

    [Fact]
    public async Task AddMigrationAsync_With_Valid_Service_Runs_Dotnet_Ef_Migrations_Add()
    {
        _processRunner.RunAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(new ProcessResult(0, "Done", ""));

        await _service.AddMigrationAsync("catalog", "InitialCreate");

        await _processRunner.Received(1).RunAsync("dotnet",
            Arg.Is<string>(a =>
                a.Contains("ef migrations add InitialCreate") &&
                a.Contains("--project src/Services/Catalog/CrownCommerce.Catalog.Infrastructure") &&
                a.Contains("--context CatalogDbContext")));
    }

    [Fact]
    public async Task AddMigrationAsync_With_Unknown_Service_Does_Not_Call_ProcessRunner()
    {
        await _service.AddMigrationAsync("unknown-service", "SomeMigration");

        await _processRunner.DidNotReceive().RunAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task ApplyMigrationsAsync_With_Valid_Service_Runs_Dotnet_Ef_Database_Update()
    {
        _processRunner.RunAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(new ProcessResult(0, "Done", ""));

        await _service.ApplyMigrationsAsync("identity", "development");

        await _processRunner.Received(1).RunAsync("dotnet",
            Arg.Is<string>(a =>
                a.Contains("ef database update") &&
                a.Contains("--project src/Services/Identity/CrownCommerce.Identity.Infrastructure") &&
                a.Contains("--context IdentityDbContext")));
    }

    [Fact]
    public async Task ApplyMigrationsAsync_With_Unknown_Service_Does_Not_Call_ProcessRunner()
    {
        await _service.ApplyMigrationsAsync("nonexistent", "development");

        await _processRunner.DidNotReceive().RunAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task AddMigrationAsync_Handles_Process_Failure_Gracefully()
    {
        _processRunner.RunAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(new ProcessResult(1, "", "Build failed"));

        var exception = await Record.ExceptionAsync(() =>
            _service.AddMigrationAsync("catalog", "BadMigration"));

        Assert.Null(exception);
    }

    [Fact]
    public async Task ApplyMigrationsAsync_Handles_Process_Failure_Gracefully()
    {
        _processRunner.RunAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(new ProcessResult(1, "", "Connection refused"));

        var exception = await Record.ExceptionAsync(() =>
            _service.ApplyMigrationsAsync("catalog", "development"));

        Assert.Null(exception);
    }

    [Fact]
    public async Task GetStatusAsync_Returns_Status_For_All_11_Services()
    {
        _processRunner.RunAsync(Arg.Any<string>(), Arg.Any<string>())
            .Returns(new ProcessResult(0, "20230101_Init\n20230201_AddProducts\n20230301_Pending (Pending)\n", ""));

        var statuses = await _service.GetStatusAsync("development");

        Assert.Equal(11, statuses.Count);
        await _processRunner.Received(11).RunAsync("dotnet", Arg.Any<string>());
    }

    [Fact]
    public void Service_Registry_Contains_All_Expected_Services()
    {
        var expectedServices = new[]
        {
            "catalog", "chat", "content", "crm", "identity",
            "inquiry", "newsletter", "notification", "order",
            "payment", "scheduling"
        };

        foreach (var service in expectedServices)
        {
            Assert.True(MigrationService.ServiceRegistry.ContainsKey(service),
                $"Service registry is missing '{service}'");
        }

        Assert.Equal(11, MigrationService.ServiceRegistry.Count);
    }
}
