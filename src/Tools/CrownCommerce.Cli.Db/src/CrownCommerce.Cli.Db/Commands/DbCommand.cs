using System.CommandLine;
using CrownCommerce.Cli.Db.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Db.Commands;

public static class DbCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Database Management CLI");

        rootCommand.AddCommand(CreateConnectionCommand(services));
        rootCommand.AddCommand(CreateListCommand(services));
        rootCommand.AddCommand(CreateHealthCommand(services));
        rootCommand.AddCommand(CreateResetCommand(services));

        return rootCommand;
    }

    private static Command CreateConnectionCommand(IServiceProvider services)
    {
        var serviceArgument = new Argument<string>(
            "service",
            "The service name (e.g. catalog, identity, order)");

        var envOption = new Option<string>(
            "--env",
            getDefaultValue: () => "development",
            "The target environment (development, staging, production)");

        var command = new Command("connection", "Get the connection string for a service database")
        {
            serviceArgument,
            envOption,
        };

        command.SetHandler(async (string service, string env) =>
        {
            var dbService = services.GetRequiredService<IDatabaseService>();
            var connectionString = await dbService.GetConnectionStringAsync(service, env);
            Console.WriteLine(connectionString);
        }, serviceArgument, envOption);

        return command;
    }

    private static Command CreateListCommand(IServiceProvider services)
    {
        var command = new Command("list", "List all registered service databases");

        command.SetHandler(async () =>
        {
            var dbService = services.GetRequiredService<IDatabaseService>();
            var databases = await dbService.ListDatabasesAsync();

            Console.WriteLine($"{"Service",-20} {"Database",-35} {"Provider",-15}");
            Console.WriteLine(new string('-', 70));

            foreach (var db in databases)
            {
                Console.WriteLine($"{db.ServiceName,-20} {db.DatabaseName,-35} {db.Provider,-15}");
            }

            Console.WriteLine();
            Console.WriteLine($"Total: {databases.Count} database(s)");
        });

        return command;
    }

    private static Command CreateHealthCommand(IServiceProvider services)
    {
        var serviceArgument = new Argument<string?>(
            "service",
            getDefaultValue: () => null,
            "The service name to check (omit to check all)");

        var command = new Command("health", "Check database connectivity for a service or all services")
        {
            serviceArgument,
        };

        command.SetHandler(async (string? service) =>
        {
            var dbService = services.GetRequiredService<IDatabaseService>();
            var healthy = await dbService.CheckHealthAsync(service);

            Console.WriteLine(healthy
                ? "All database health checks passed."
                : "One or more database health checks failed.");
        }, serviceArgument);

        return command;
    }

    private static Command CreateResetCommand(IServiceProvider services)
    {
        var serviceArgument = new Argument<string>(
            "service",
            "The service database to reset");

        var envOption = new Option<string>(
            "--env",
            getDefaultValue: () => "development",
            "The target environment");

        var confirmOption = new Option<bool>(
            "--confirm",
            "Confirm the destructive reset operation");

        var command = new Command("reset", "Reset a service database (destructive)")
        {
            serviceArgument,
            envOption,
            confirmOption,
        };

        command.SetHandler(async (string service, string env, bool confirm) =>
        {
            if (!confirm)
            {
                Console.WriteLine("Reset aborted. Use --confirm to proceed with the destructive operation.");
                return;
            }

            var dbService = services.GetRequiredService<IDatabaseService>();
            var success = await dbService.ResetDatabaseAsync(service, env);

            Console.WriteLine(success
                ? $"Database for '{service}' has been reset in '{env}'."
                : $"Failed to reset database for '{service}'.");
        }, serviceArgument, envOption, confirmOption);

        return command;
    }
}
