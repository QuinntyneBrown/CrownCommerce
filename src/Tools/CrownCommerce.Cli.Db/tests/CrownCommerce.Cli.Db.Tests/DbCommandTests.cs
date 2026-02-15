using System.CommandLine;
using CrownCommerce.Cli.Db.Commands;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Db.Tests;

public class DbCommandTests
{
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
}
