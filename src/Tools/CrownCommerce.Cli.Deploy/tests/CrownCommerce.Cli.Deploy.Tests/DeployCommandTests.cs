using System.CommandLine;
using CrownCommerce.Cli.Deploy.Commands;
using CrownCommerce.Cli.Deploy.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Deploy.Tests;

public class DeployCommandTests
{
    private readonly IDeploymentService _deploymentService;

    public DeployCommandTests()
    {
        _deploymentService = Substitute.For<IDeploymentService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_deploymentService);
        return DeployCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Service_Command_With_Valid_Name_And_Env_Returns_Zero()
    {
        _deploymentService.DeployServiceAsync("catalog", "staging").Returns(true);

        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["service", "catalog", "--env", "staging"]);

        Assert.Equal(0, exitCode);
    }

    [Fact]
    public async Task Frontend_Command_With_Valid_Name_And_Env_Returns_Zero()
    {
        _deploymentService.DeployFrontendAsync("mane-haus", "production").Returns(true);

        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["frontend", "mane-haus", "--env", "production"]);

        Assert.Equal(0, exitCode);
    }

    [Fact]
    public async Task Status_Command_With_Env_Returns_Zero()
    {
        _deploymentService.GetStatusAsync("staging").Returns(true);

        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["status", "--env", "staging"]);

        Assert.Equal(0, exitCode);
        await _deploymentService.Received(1).GetStatusAsync("staging");
    }

    [Fact]
    public async Task All_Command_With_Env_Returns_Zero()
    {
        _deploymentService.DeployAllAsync("staging", false).Returns(true);

        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["all", "--env", "staging"]);

        Assert.Equal(0, exitCode);
        await _deploymentService.Received(1).DeployAllAsync("staging", false);
    }

    [Fact]
    public async Task All_Command_With_DryRun_Flag_Passes_True()
    {
        _deploymentService.DeployAllAsync("staging", true).Returns(true);

        var rootCommand = CreateCommand();
        var exitCode = await rootCommand.InvokeAsync(["all", "--env", "staging", "--dry-run"]);

        Assert.Equal(0, exitCode);
        await _deploymentService.Received(1).DeployAllAsync("staging", true);
    }

    [Fact]
    public async Task Service_Command_Passes_Correct_Arguments_To_Service()
    {
        _deploymentService.DeployServiceAsync("identity", "production").Returns(true);

        var rootCommand = CreateCommand();
        await rootCommand.InvokeAsync(["service", "identity", "--env", "production"]);

        await _deploymentService.Received(1).DeployServiceAsync("identity", "production");
    }

    [Fact]
    public async Task Frontend_Command_Passes_Correct_Arguments_To_Service()
    {
        _deploymentService.DeployFrontendAsync("crown-commerce-admin", "staging").Returns(true);

        var rootCommand = CreateCommand();
        await rootCommand.InvokeAsync(["frontend", "crown-commerce-admin", "--env", "staging"]);

        await _deploymentService.Received(1).DeployFrontendAsync("crown-commerce-admin", "staging");
    }
}

public class DeploymentServiceTests
{
    private readonly IProcessRunner _processRunner;
    private readonly DeploymentService _service;

    public DeploymentServiceTests()
    {
        _processRunner = Substitute.For<IProcessRunner>();
        var logger = new NullLogger<DeploymentService>();
        _service = new DeploymentService(logger, _processRunner);
    }

    [Fact]
    public async Task DeployServiceAsync_With_Valid_Service_Runs_Az_Command()
    {
        _processRunner.RunAsync("az", Arg.Is<string>(s => s.Contains("containerapp update") && s.Contains("catalog")))
            .Returns(new ProcessResult(0, "success", ""));

        var result = await _service.DeployServiceAsync("catalog", "staging");

        Assert.True(result);
        await _processRunner.Received(1).RunAsync("az", Arg.Is<string>(s =>
            s.Contains("containerapp update") &&
            s.Contains("crowncommerce-catalog") &&
            s.Contains("crowncommerce-staging")));
    }

    [Fact]
    public async Task DeployServiceAsync_With_Invalid_Service_Returns_False_Without_Running()
    {
        var result = await _service.DeployServiceAsync("nonexistent", "staging");

        Assert.False(result);
        await _processRunner.DidNotReceive().RunAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task DeployFrontendAsync_With_Valid_Frontend_Runs_Az_Command()
    {
        _processRunner.RunAsync("az", Arg.Is<string>(s => s.Contains("staticwebapp deploy") && s.Contains("mane-haus")))
            .Returns(new ProcessResult(0, "success", ""));

        var result = await _service.DeployFrontendAsync("mane-haus", "production");

        Assert.True(result);
        await _processRunner.Received(1).RunAsync("az", Arg.Is<string>(s =>
            s.Contains("staticwebapp deploy") &&
            s.Contains("mane-haus") &&
            s.Contains("production")));
    }

    [Fact]
    public async Task DeployFrontendAsync_With_Invalid_Frontend_Returns_False()
    {
        var result = await _service.DeployFrontendAsync("nonexistent", "staging");

        Assert.False(result);
        await _processRunner.DidNotReceive().RunAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task DeployAllAsync_With_DryRun_True_Does_Not_Call_ProcessRunner()
    {
        var result = await _service.DeployAllAsync("staging", dryRun: true);

        Assert.True(result);
        await _processRunner.DidNotReceive().RunAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task DeployAllAsync_With_DryRun_False_Calls_ProcessRunner_For_Each_Component()
    {
        _processRunner.RunAsync("az", Arg.Any<string>())
            .Returns(new ProcessResult(0, "success", ""));

        var result = await _service.DeployAllAsync("staging", dryRun: false);

        Assert.True(result);

        var expectedCallCount = DeploymentService.BackendServices.Length + DeploymentService.Frontends.Length;
        await _processRunner.Received(expectedCallCount).RunAsync("az", Arg.Any<string>());
    }

    [Fact]
    public async Task GetStatusAsync_Calls_ProcessRunner()
    {
        _processRunner.RunAsync("az", Arg.Is<string>(s => s.Contains("containerapp list")))
            .Returns(new ProcessResult(0, "[]", ""));
        _processRunner.RunAsync("az", Arg.Is<string>(s => s.Contains("staticwebapp list")))
            .Returns(new ProcessResult(0, "[]", ""));

        var result = await _service.GetStatusAsync("staging");

        Assert.True(result);
        await _processRunner.Received(1).RunAsync("az", Arg.Is<string>(s => s.Contains("containerapp list")));
        await _processRunner.Received(1).RunAsync("az", Arg.Is<string>(s => s.Contains("staticwebapp list")));
    }

    [Fact]
    public async Task DeployServiceAsync_Returns_False_When_Process_Exits_With_NonZero()
    {
        _processRunner.RunAsync("az", Arg.Any<string>())
            .Returns(new ProcessResult(1, "", "deployment failed"));

        var result = await _service.DeployServiceAsync("catalog", "staging");

        Assert.False(result);
    }
}
