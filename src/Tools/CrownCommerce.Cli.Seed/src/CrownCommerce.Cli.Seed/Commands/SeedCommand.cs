using System.CommandLine;
using CrownCommerce.Cli.Seed.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Seed.Commands;

public static class SeedCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Database Seeder");

        var serviceArg = new Argument<string>("service", "The target microservice name (or 'all')");
        var profileOption = new Option<string>("--profile", () => "demo", "Seed data profile");
        var resetOption = new Option<bool>("--reset", () => false, "Reset existing data before seeding");
        var dryRunOption = new Option<bool>("--dry-run", () => false, "Preview seed operations without executing");

        rootCommand.AddArgument(serviceArg);
        rootCommand.AddOption(profileOption);
        rootCommand.AddOption(resetOption);
        rootCommand.AddOption(dryRunOption);

        rootCommand.SetHandler(async (string service, string profile, bool reset, bool dryRun) =>
        {
            var seedService = services.GetRequiredService<ISeedService>();
            await seedService.SeedAsync(service, profile, reset, dryRun);
        }, serviceArg, profileOption, resetOption, dryRunOption);

        return rootCommand;
    }
}
