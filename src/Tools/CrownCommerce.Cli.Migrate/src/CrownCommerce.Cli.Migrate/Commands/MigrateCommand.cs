using System.CommandLine;
using CrownCommerce.Cli.Migrate.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Migrate.Commands;

public static class MigrateCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Database Migration Manager");

        rootCommand.AddCommand(CreateAddCommand(services));
        rootCommand.AddCommand(CreateApplyCommand(services));
        rootCommand.AddCommand(CreateStatusCommand(services));

        return rootCommand;
    }

    private static Command CreateAddCommand(IServiceProvider services)
    {
        var serviceArg = new Argument<string>("service", "The target microservice name");
        var nameArg = new Argument<string>("name", "The migration name");

        var command = new Command("add", "Add a new migration to a service")
        {
            serviceArg,
            nameArg,
        };

        command.SetHandler(async (string service, string name) =>
        {
            var migrationService = services.GetRequiredService<IMigrationService>();
            await migrationService.AddMigrationAsync(service, name);
        }, serviceArg, nameArg);

        return command;
    }

    private static Command CreateApplyCommand(IServiceProvider services)
    {
        var serviceArg = new Argument<string>("service", "The target microservice name");
        var envOption = new Option<string>("--env", () => "development", "Target environment");

        var command = new Command("apply", "Apply pending migrations to a service")
        {
            serviceArg,
            envOption,
        };

        command.SetHandler(async (string service, string env) =>
        {
            var migrationService = services.GetRequiredService<IMigrationService>();
            await migrationService.ApplyMigrationsAsync(service, env);
        }, serviceArg, envOption);

        return command;
    }

    private static Command CreateStatusCommand(IServiceProvider services)
    {
        var envOption = new Option<string>("--env", () => "development", "Target environment");

        var command = new Command("status", "Show migration status for all services")
        {
            envOption,
        };

        command.SetHandler(async (string env) =>
        {
            var migrationService = services.GetRequiredService<IMigrationService>();
            var statuses = await migrationService.GetStatusAsync(env);

            Console.WriteLine($"{"Service",-20} {"Applied",-10} {"Pending",-10}");
            Console.WriteLine(new string('-', 40));

            foreach (var status in statuses)
            {
                Console.WriteLine($"{status.ServiceName,-20} {status.AppliedCount,-10} {status.PendingCount,-10}");
            }
        }, envOption);

        return command;
    }
}
