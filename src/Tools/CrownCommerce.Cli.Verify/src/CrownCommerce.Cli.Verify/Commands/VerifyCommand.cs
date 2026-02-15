using System.CommandLine;
using CrownCommerce.Cli.Verify.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Verify.Commands;

public static class VerifyCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Deployment Verification CLI");

        rootCommand.AddCommand(CreateListSubscribersCommand(services));

        return rootCommand;
    }

    private static Command CreateListSubscribersCommand(IServiceProvider services)
    {
        var tagOption = new Option<string?>(
            "--tag",
            "Filter by specific tag (e.g. origin-hair-collective-coming-soon, mane-haus-coming-soon)");

        var command = new Command("list-subscribers", "List all users who signed up via coming-soon sites")
        {
            tagOption,
        };

        command.SetHandler(async (string? tag) =>
        {
            using var scope = services.CreateScope();
            var queryService = scope.ServiceProvider.GetRequiredService<ISubscriberQueryService>();

            var subscribers = await queryService.GetComingSoonSubscribersAsync(tag);

            if (subscribers.Count == 0)
            {
                Console.WriteLine("No coming-soon subscribers found.");
                return;
            }

            Console.WriteLine($"{"Email",-40} {"Name",-30} {"Status",-15} {"Signed Up",-22} {"Tags"}");
            Console.WriteLine(new string('-', 130));

            foreach (var sub in subscribers)
            {
                var name = $"{sub.FirstName} {sub.LastName}".Trim();
                var tags = string.Join(", ", sub.Tags);
                Console.WriteLine($"{sub.Email,-40} {name,-30} {sub.Status,-15} {sub.CreatedAt:yyyy-MM-dd HH:mm:ss}   {tags}");
            }

            Console.WriteLine();
            Console.WriteLine($"Total: {subscribers.Count} subscriber(s)");
        }, tagOption);

        return command;
    }
}
