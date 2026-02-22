using CrownCommerce.Cli.Db.Commands;
using CrownCommerce.Cli.Db.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Db.Tests;

public class DatabaseServiceTests
{
    private readonly IConnectionStringProvider _provider;
    private readonly DatabaseService _service;

    public DatabaseServiceTests()
    {
        _provider = Substitute.For<IConnectionStringProvider>();
        var logger = NullLoggerFactory.Instance.CreateLogger<DatabaseService>();
        _service = new DatabaseService(logger, _provider);
    }

    [Fact]
    public async Task GetConnectionStringAsync_Delegates_To_Provider()
    {
        _provider.GetConnectionStringAsync("catalog", "development")
            .Returns("Server=(localdb)\\MSSQLLocalDB;Database=CrownCommerce_Catalog;");

        var result = await _service.GetConnectionStringAsync("catalog", "development");

        Assert.Equal("Server=(localdb)\\MSSQLLocalDB;Database=CrownCommerce_Catalog;", result);
        await _provider.Received(1).GetConnectionStringAsync("catalog", "development");
    }

    [Fact]
    public async Task ListDatabasesAsync_Returns_All_11_Service_Databases()
    {
        _provider.GetConnectionStringAsync(Arg.Any<string>(), "development")
            .Returns(callInfo => $"Server=test;Database=CrownCommerce_{callInfo.ArgAt<string>(0)};");

        var result = await _service.ListDatabasesAsync();

        Assert.Equal(11, result.Count);

        var serviceNames = result.Select(r => r.ServiceName).ToList();
        Assert.Contains("catalog", serviceNames);
        Assert.Contains("chat", serviceNames);
        Assert.Contains("content", serviceNames);
        Assert.Contains("crm", serviceNames);
        Assert.Contains("identity", serviceNames);
        Assert.Contains("inquiry", serviceNames);
        Assert.Contains("newsletter", serviceNames);
        Assert.Contains("notification", serviceNames);
        Assert.Contains("order", serviceNames);
        Assert.Contains("payment", serviceNames);
        Assert.Contains("scheduling", serviceNames);
    }

    [Fact]
    public async Task CheckHealthAsync_With_Null_Checks_All_Services()
    {
        _provider.GetConnectionStringAsync(Arg.Any<string>(), "development")
            .Returns("Server=test;");

        var result = await _service.CheckHealthAsync(null);

        Assert.True(result);
        await _provider.Received(11).GetConnectionStringAsync(Arg.Any<string>(), "development");
    }

    [Fact]
    public async Task CheckHealthAsync_With_Specific_Service_Checks_Only_That_One()
    {
        _provider.GetConnectionStringAsync("catalog", "development")
            .Returns("Server=test;");

        var result = await _service.CheckHealthAsync("catalog");

        Assert.True(result);
        await _provider.Received(1).GetConnectionStringAsync("catalog", "development");
    }

    [Fact]
    public async Task ResetDatabaseAsync_Calls_Provider_For_ConnectionString()
    {
        _provider.GetConnectionStringAsync("catalog", "development")
            .Returns("Server=test;Database=CrownCommerce_Catalog;");

        var result = await _service.ResetDatabaseAsync("catalog", "development");

        Assert.True(result);
        await _provider.Received(1).GetConnectionStringAsync("catalog", "development");
    }

    [Fact]
    public async Task GetConnectionStringAsync_With_Unknown_Service_Still_Delegates_To_Provider()
    {
        _provider.GetConnectionStringAsync("unknown", "development")
            .Returns("Server=test;Database=CrownCommerce_Unknown;");

        var result = await _service.GetConnectionStringAsync("unknown", "development");

        Assert.Equal("Server=test;Database=CrownCommerce_Unknown;", result);
        await _provider.Received(1).GetConnectionStringAsync("unknown", "development");
    }

    [Fact]
    public async Task ResetDatabaseAsync_With_Unknown_Service_Returns_False()
    {
        var result = await _service.ResetDatabaseAsync("unknown", "development");

        Assert.False(result);
        await _provider.DidNotReceive().GetConnectionStringAsync(Arg.Any<string>(), Arg.Any<string>());
    }
}
