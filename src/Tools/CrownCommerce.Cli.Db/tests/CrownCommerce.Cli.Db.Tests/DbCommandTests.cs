using System.CommandLine;
using CrownCommerce.Cli.Db.Commands;
using CrownCommerce.Cli.Db.Services;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Db.Tests;

public class DbCommandTests
{
    private readonly IDatabaseService _dbService;

    public DbCommandTests()
    {
        _dbService = Substitute.For<IDatabaseService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_dbService);
        return DbCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Connection_Command_Calls_GetConnectionStringAsync_And_Returns_Zero()
    {
        // Arrange
        var fakeDatabaseService = Substitute.For<IDatabaseService>();
        fakeDatabaseService.GetConnectionStringAsync("catalog", "development")
            .Returns("Server=(localdb)\\MSSQLLocalDB;Database=CrownCommerce_Catalog;Trusted_Connection=True;TrustServerCertificate=True;");

        var services = new ServiceCollection();
        services.AddSingleton(fakeDatabaseService);
        var serviceProvider = services.BuildServiceProvider();

        var rootCommand = DbCommand.Create(serviceProvider);

        // Act
        var exitCode = await rootCommand.InvokeAsync(["connection", "catalog"]);

        // Assert
        Assert.Equal(0, exitCode);
        await fakeDatabaseService.Received(1).GetConnectionStringAsync("catalog", "development");
    }

    [Fact]
    public async Task Connection_Command_With_Env_Option_Passes_Correct_Env()
    {
        _dbService.GetConnectionStringAsync("catalog", "staging")
            .Returns("Server=staging-db;Database=CrownCommerce_Catalog;");

        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["connection", "catalog", "--env", "staging"]);

        Assert.Equal(0, exitCode);
        await _dbService.Received(1).GetConnectionStringAsync("catalog", "staging");
    }

    [Fact]
    public async Task List_Command_Calls_ListDatabasesAsync()
    {
        _dbService.ListDatabasesAsync()
            .Returns(new List<DatabaseInfo>
            {
                new("catalog", "CrownCommerce_Catalog", "SqlServer", "Server=test;"),
            });

        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["list"]);

        Assert.Equal(0, exitCode);
        await _dbService.Received(1).ListDatabasesAsync();
    }

    [Fact]
    public async Task Health_Command_Calls_CheckHealthAsync_With_Null_When_No_Service()
    {
        _dbService.CheckHealthAsync(null).Returns(true);

        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["health"]);

        Assert.Equal(0, exitCode);
        await _dbService.Received(1).CheckHealthAsync(null);
    }

    [Fact]
    public async Task Health_Command_With_Service_Passes_Correct_Value()
    {
        _dbService.CheckHealthAsync("catalog").Returns(true);

        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["health", "catalog"]);

        Assert.Equal(0, exitCode);
        await _dbService.Received(1).CheckHealthAsync("catalog");
    }

    [Fact]
    public async Task Reset_Command_With_Confirm_Calls_ResetDatabaseAsync()
    {
        _dbService.ResetDatabaseAsync("catalog", "development").Returns(true);

        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["reset", "catalog", "--confirm"]);

        Assert.Equal(0, exitCode);
        await _dbService.Received(1).ResetDatabaseAsync("catalog", "development");
    }

    [Fact]
    public async Task Reset_Command_Without_Confirm_Does_Not_Call_ResetDatabaseAsync()
    {
        var rootCommand = CreateCommand();

        var exitCode = await rootCommand.InvokeAsync(["reset", "catalog"]);

        Assert.Equal(0, exitCode);
        await _dbService.DidNotReceive().ResetDatabaseAsync(Arg.Any<string>(), Arg.Any<string>());
    }
}
