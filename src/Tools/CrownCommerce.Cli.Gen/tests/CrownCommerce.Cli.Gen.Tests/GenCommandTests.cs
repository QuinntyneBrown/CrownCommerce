using System.CommandLine;
using CrownCommerce.Cli.Gen.Commands;
using CrownCommerce.Cli.Gen.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Gen.Tests;

public class GenCommandTests
{
    private readonly IGeneratorService _genService;

    public GenCommandTests()
    {
        _genService = Substitute.For<IGeneratorService>();
        _genService.GenerateEntityAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        _genService.GenerateConsumerAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        _genService.GenerateServiceAsync(Arg.Any<string>()).Returns(Task.CompletedTask);
        _genService.GeneratePageAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_genService);
        return GenCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Entity_Command_Returns_Zero()
    {
        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["entity", "catalog", "HairBundle"]);
        Assert.Equal(0, exitCode);
    }

    [Fact]
    public async Task Entity_Command_Passes_Correct_Args()
    {
        var rootCommand = CreateCommand();
        await rootCommand.InvokeAsync(["entity", "catalog", "HairBundle"]);
        await _genService.Received(1).GenerateEntityAsync("catalog", "HairBundle");
    }

    [Fact]
    public async Task Consumer_Command_Returns_Zero()
    {
        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["consumer", "orders", "OrderPlaced"]);
        Assert.Equal(0, exitCode);
    }

    [Fact]
    public async Task Consumer_Command_Passes_Correct_Args()
    {
        var rootCommand = CreateCommand();
        await rootCommand.InvokeAsync(["consumer", "orders", "OrderPlaced"]);
        await _genService.Received(1).GenerateConsumerAsync("orders", "OrderPlaced");
    }

    [Fact]
    public async Task Service_Command_Returns_Zero()
    {
        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["service", "inventory"]);
        Assert.Equal(0, exitCode);
    }

    [Fact]
    public async Task Page_Command_Returns_Zero()
    {
        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["page", "origin-hair-collective", "ProductDetails"]);
        Assert.Equal(0, exitCode);
    }

    [Fact]
    public async Task Page_Command_Passes_Correct_Args()
    {
        var rootCommand = CreateCommand();
        await rootCommand.InvokeAsync(["page", "origin-hair-collective", "ProductDetails"]);
        await _genService.Received(1).GeneratePageAsync("origin-hair-collective", "ProductDetails");
    }
}

public class GeneratorServiceTests
{
    private readonly IFileSystem _fileSystem;
    private readonly GeneratorService _service;

    public GeneratorServiceTests()
    {
        _fileSystem = Substitute.For<IFileSystem>();
        _fileSystem.WriteFileAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Task.CompletedTask);
        _fileSystem.CreateDirectoryAsync(Arg.Any<string>()).Returns(Task.CompletedTask);

        var logger = new NullLogger<GeneratorService>();
        _service = new GeneratorService(logger, _fileSystem);
    }

    [Fact]
    public async Task GenerateEntityAsync_Creates_Entity_File_At_Correct_Path()
    {
        await _service.GenerateEntityAsync("catalog", "HairBundle");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("Catalog") && p.Contains("Core/Entities/HairBundle.cs")),
            Arg.Any<string>());
    }

    [Fact]
    public async Task GenerateEntityAsync_Creates_Controller_File()
    {
        await _service.GenerateEntityAsync("catalog", "HairBundle");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("Api/Controllers/HairBundleController.cs")),
            Arg.Any<string>());
    }

    [Fact]
    public async Task GenerateEntityAsync_Creates_Directory_Structure_First()
    {
        await _service.GenerateEntityAsync("catalog", "HairBundle");

        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("Core/Entities")));
        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("Api/Controllers")));
        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("Infrastructure/Data")));
    }

    [Fact]
    public async Task GenerateConsumerAsync_Creates_Consumer_File_At_Correct_Path()
    {
        await _service.GenerateConsumerAsync("orders", "OrderPlaced");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("Orders") && p.Contains("Application/Consumers/OrderPlacedConsumer.cs")),
            Arg.Any<string>());
    }

    [Fact]
    public async Task GenerateServiceAsync_Creates_All_Four_Project_Directories()
    {
        await _service.GenerateServiceAsync("inventory");

        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("CrownCommerce.Inventory.Core")));
        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("CrownCommerce.Inventory.Infrastructure")));
        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("CrownCommerce.Inventory.Application")));
        await _fileSystem.Received().CreateDirectoryAsync(
            Arg.Is<string>(p => p.Contains("CrownCommerce.Inventory.Api")));
    }

    [Fact]
    public async Task GenerateServiceAsync_Creates_ProgramCs_In_Api_Project()
    {
        await _service.GenerateServiceAsync("inventory");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("CrownCommerce.Inventory.Api/Program.cs")),
            Arg.Is<string>(c => c.Contains("WebApplication.CreateBuilder")));
    }

    [Fact]
    public async Task GeneratePageAsync_Creates_Ts_Html_Scss_Files()
    {
        await _service.GeneratePageAsync("origin-hair-collective", "ProductDetails");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("product-details/product-details.component.ts")),
            Arg.Any<string>());
        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("product-details/product-details.component.html")),
            Arg.Any<string>());
        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("product-details/product-details.component.scss")),
            Arg.Any<string>());
    }

    [Fact]
    public async Task GeneratePageAsync_Converts_PascalCase_To_KebabCase()
    {
        await _service.GeneratePageAsync("mane-haus", "MyAccountSettings");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("my-account-settings/my-account-settings.component.ts")),
            Arg.Any<string>());
    }

    [Fact]
    public async Task Entity_File_Content_Contains_Correct_Class_Name()
    {
        await _service.GenerateEntityAsync("catalog", "HairBundle");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("Entities/HairBundle.cs")),
            Arg.Is<string>(c => c.Contains("public class HairBundle")));
    }

    [Fact]
    public async Task Consumer_File_Content_Contains_Correct_Event_Name()
    {
        await _service.GenerateConsumerAsync("orders", "OrderPlaced");

        await _fileSystem.Received().WriteFileAsync(
            Arg.Is<string>(p => p.Contains("OrderPlacedConsumer.cs")),
            Arg.Is<string>(c => c.Contains("IConsumer<OrderPlaced>")));
    }
}
