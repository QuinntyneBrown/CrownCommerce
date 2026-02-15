using System.CommandLine;
using System.CommandLine.Invocation;
using CrownCommerce.Cli.Cron.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Cron.Commands;

public static class CronCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("cc-cron - Local job scheduler for recurring background tasks");

        rootCommand.AddCommand(CreateListCommand(services));
        rootCommand.AddCommand(CreateRunCommand(services));
        rootCommand.AddCommand(CreateStartCommand(services));
        rootCommand.AddCommand(CreateHistoryCommand(services));

        return rootCommand;
    }

    private static Command CreateListCommand(IServiceProvider services)
    {
        var command = new Command("list", "List all registered cron jobs");

        command.SetHandler(async (InvocationContext context) =>
        {
            var service = services.GetRequiredService<ICronService>();
            var jobs = await service.ListJobsAsync();

            Console.WriteLine($"{"Name",-30} {"Schedule",-20} {"Service",-15} {"Description"}");
            Console.WriteLine(new string('-', 100));

            foreach (var job in jobs)
            {
                Console.WriteLine($"{job.Name,-30} {job.Schedule,-20} {job.TargetService,-15} {job.Description}");
            }

            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateRunCommand(IServiceProvider services)
    {
        var jobNameArg = new Argument<string>("job-name", "The name of the job to run");
        var command = new Command("run", "Run a specific cron job immediately") { jobNameArg };

        command.SetHandler(async (InvocationContext context) =>
        {
            var jobName = context.ParseResult.GetValueForArgument(jobNameArg);
            var service = services.GetRequiredService<ICronService>();
            var success = await service.RunJobAsync(jobName);

            context.ExitCode = success ? 0 : 1;
        });

        return command;
    }

    private static Command CreateStartCommand(IServiceProvider services)
    {
        var jobOption = new Option<string?>("--job", "Optional job filter (run only this job)");
        var command = new Command("start", "Start the cron daemon") { jobOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var jobFilter = context.ParseResult.GetValueForOption(jobOption);
            var service = services.GetRequiredService<ICronService>();
            await service.StartDaemonAsync(jobFilter);

            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateHistoryCommand(IServiceProvider services)
    {
        var jobNameArg = new Argument<string?>("job-name", () => null, "Optional job name to filter history");
        var command = new Command("history", "Show job execution history") { jobNameArg };

        command.SetHandler(async (InvocationContext context) =>
        {
            var jobName = context.ParseResult.GetValueForArgument(jobNameArg);
            var service = services.GetRequiredService<ICronService>();
            var history = await service.GetHistoryAsync(jobName);

            Console.WriteLine($"{"Job",-30} {"Executed At",-25} {"Status",-10} {"Error"}");
            Console.WriteLine(new string('-', 80));

            foreach (var entry in history)
            {
                Console.WriteLine($"{entry.JobName,-30} {entry.ExecutedAt:u,-25} {entry.Status,-10} {entry.Error ?? ""}");
            }

            context.ExitCode = 0;
        });

        return command;
    }
}
