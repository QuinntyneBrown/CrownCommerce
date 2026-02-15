using System.CommandLine;
using CrownCommerce.Cli.Env.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Env.Commands;

public static class EnvCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Environment and Health Manager");

        rootCommand.AddCommand(CreateHealthCommand(services));
        rootCommand.AddCommand(CreateDatabasesCommand(services));
        rootCommand.AddCommand(CreatePortsCommand(services));
        rootCommand.AddCommand(CreateUpCommand(services));
        rootCommand.AddCommand(CreateDownCommand(services));

        return rootCommand;
    }

    private static Command CreateHealthCommand(IServiceProvider services)
    {
        var envOption = new Option<string>("--env", () => "development", "Target environment");

        var command = new Command("health", "Check health of all services in an environment")
        {
            envOption,
        };

        command.SetHandler(async (string env) =>
        {
            var envService = services.GetRequiredService<IEnvironmentService>();
            await envService.CheckHealthAsync(env);
        }, envOption);

        return command;
    }

    private static Command CreateDatabasesCommand(IServiceProvider services)
    {
        var command = new Command("databases", "List all service databases");

        command.SetHandler(async () =>
        {
            var envService = services.GetRequiredService<IEnvironmentService>();
            await envService.ListDatabasesAsync();
        });

        return command;
    }

    private static Command CreatePortsCommand(IServiceProvider services)
    {
        var command = new Command("ports", "List all service port assignments");

        command.SetHandler(async () =>
        {
            var envService = services.GetRequiredService<IEnvironmentService>();
            await envService.ListPortsAsync();
        });

        return command;
    }

    private static Command CreateUpCommand(IServiceProvider services)
    {
        var servicesOption = new Option<string?>("--services", "Comma-separated list of services to start");
        var frontendsOption = new Option<string?>("--frontends", "Comma-separated list of frontends to start");

        var command = new Command("up", "Start services and frontends")
        {
            servicesOption,
            frontendsOption,
        };

        command.SetHandler(async (string? svcList, string? feList) =>
        {
            var envService = services.GetRequiredService<IEnvironmentService>();
            var svcs = svcList?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var fes = feList?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            await envService.StartAsync(svcs, fes);
        }, servicesOption, frontendsOption);

        return command;
    }

    private static Command CreateDownCommand(IServiceProvider services)
    {
        var command = new Command("down", "Stop all running processes");

        command.SetHandler(async () =>
        {
            var envService = services.GetRequiredService<IEnvironmentService>();
            await envService.StopAsync();
        });

        return command;
    }
}
