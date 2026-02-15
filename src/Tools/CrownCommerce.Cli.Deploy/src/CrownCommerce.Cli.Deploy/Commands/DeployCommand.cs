using System.CommandLine;
using CrownCommerce.Cli.Deploy.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Deploy.Commands;

public static class DeployCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Azure Deployment Orchestrator");

        rootCommand.AddCommand(CreateServiceCommand(services));
        rootCommand.AddCommand(CreateFrontendCommand(services));
        rootCommand.AddCommand(CreateStatusCommand(services));
        rootCommand.AddCommand(CreateAllCommand(services));

        return rootCommand;
    }

    private static Command CreateServiceCommand(IServiceProvider services)
    {
        var nameArg = new Argument<string>("name", "The service to deploy");
        var envOption = new Option<string>("--env", "Target environment") { IsRequired = true };

        var command = new Command("service", "Deploy a backend service")
        {
            nameArg,
            envOption,
        };

        command.SetHandler(async (string name, string env) =>
        {
            var deploymentService = services.GetRequiredService<IDeploymentService>();
            await deploymentService.DeployServiceAsync(name, env);
        }, nameArg, envOption);

        return command;
    }

    private static Command CreateFrontendCommand(IServiceProvider services)
    {
        var nameArg = new Argument<string>("name", "The frontend to deploy");
        var envOption = new Option<string>("--env", "Target environment") { IsRequired = true };

        var command = new Command("frontend", "Deploy a frontend application")
        {
            nameArg,
            envOption,
        };

        command.SetHandler(async (string name, string env) =>
        {
            var deploymentService = services.GetRequiredService<IDeploymentService>();
            await deploymentService.DeployFrontendAsync(name, env);
        }, nameArg, envOption);

        return command;
    }

    private static Command CreateStatusCommand(IServiceProvider services)
    {
        var envOption = new Option<string>("--env", "Target environment") { IsRequired = true };

        var command = new Command("status", "Show deployment status")
        {
            envOption,
        };

        command.SetHandler(async (string env) =>
        {
            var deploymentService = services.GetRequiredService<IDeploymentService>();
            await deploymentService.GetStatusAsync(env);
        }, envOption);

        return command;
    }

    private static Command CreateAllCommand(IServiceProvider services)
    {
        var envOption = new Option<string>("--env", "Target environment") { IsRequired = true };
        var dryRunOption = new Option<bool>("--dry-run", () => false, "Preview deployment without executing");

        var command = new Command("all", "Deploy all services and frontends")
        {
            envOption,
            dryRunOption,
        };

        command.SetHandler(async (string env, bool dryRun) =>
        {
            var deploymentService = services.GetRequiredService<IDeploymentService>();
            await deploymentService.DeployAllAsync(env, dryRun);
        }, envOption, dryRunOption);

        return command;
    }
}
