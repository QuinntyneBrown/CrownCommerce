using System.CommandLine;
using CrownCommerce.Cli.Sync.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Sync.Commands;

public static class SyncCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Timezone-Aware Collaboration Tool");

        rootCommand.AddCommand(CreateNowCommand(services));
        rootCommand.AddCommand(CreateHandoffCommand(services));
        rootCommand.AddCommand(CreateInboxCommand(services));
        rootCommand.AddCommand(CreateOverlapCommand(services));
        rootCommand.AddCommand(CreateFocusCommand(services));

        return rootCommand;
    }

    private static Command CreateNowCommand(IServiceProvider services)
    {
        var command = new Command("now", "Show current team status with local times");

        command.SetHandler(async () =>
        {
            var syncService = services.GetRequiredService<ISyncService>();
            await syncService.ShowTeamStatusAsync();
        });

        return command;
    }

    private static Command CreateHandoffCommand(IServiceProvider services)
    {
        var toOption = new Option<string>("--to", "Employee name to hand off to") { IsRequired = true };
        var messageOption = new Option<string>("--message", "Handoff message") { IsRequired = true };

        var command = new Command("handoff", "Create a handoff note for a team member")
        {
            toOption,
            messageOption,
        };

        command.SetHandler(async (string to, string message) =>
        {
            var syncService = services.GetRequiredService<ISyncService>();
            await syncService.CreateHandoffAsync(to, message);
        }, toOption, messageOption);

        return command;
    }

    private static Command CreateInboxCommand(IServiceProvider services)
    {
        var command = new Command("inbox", "View pending handoff notes");

        command.SetHandler(async () =>
        {
            var syncService = services.GetRequiredService<ISyncService>();
            await syncService.GetInboxAsync();
        });

        return command;
    }

    private static Command CreateOverlapCommand(IServiceProvider services)
    {
        var membersArg = new Argument<string[]>("members", "Team member names to check overlap for")
        {
            Arity = ArgumentArity.OneOrMore,
        };

        var command = new Command("overlap", "Find overlapping working hours for team members")
        {
            membersArg,
        };

        command.SetHandler(async (string[] members) =>
        {
            var syncService = services.GetRequiredService<ISyncService>();
            await syncService.FindOverlapAsync(members);
        }, membersArg);

        return command;
    }

    private static Command CreateFocusCommand(IServiceProvider services)
    {
        var durationOption = new Option<string>("--duration", "Focus duration (e.g., 2h, 30m)") { IsRequired = true };
        var messageOption = new Option<string>("--message", "Focus status message") { IsRequired = true };

        var command = new Command("focus", "Start a focus session with a status message")
        {
            durationOption,
            messageOption,
        };

        command.SetHandler(async (string duration, string message) =>
        {
            var syncService = services.GetRequiredService<ISyncService>();
            await syncService.StartFocusAsync(duration, message);
        }, durationOption, messageOption);

        return command;
    }
}
