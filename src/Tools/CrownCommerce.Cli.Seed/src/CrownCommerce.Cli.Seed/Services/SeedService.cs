using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Seed.Services;

public class SeedService : ISeedService
{
    private readonly ILogger<SeedService> _logger;

    public static readonly string[] ServicesWithSeeders =
    [
        "catalog", "content", "identity", "newsletter", "scheduling"
    ];

    public static readonly string[] SupportedProfiles =
    [
        "minimal", "demo", "load-test", "e2e"
    ];

    public SeedService(ILogger<SeedService> logger)
    {
        _logger = logger;
    }

    public Task SeedAsync(string service, string profile, bool reset, bool dryRun)
    {
        if (!SupportedProfiles.Contains(profile))
        {
            _logger.LogError("Unknown profile: {Profile}. Supported profiles: {Profiles}",
                profile, string.Join(", ", SupportedProfiles));
            return Task.CompletedTask;
        }

        if (service == "all")
        {
            foreach (var svc in ServicesWithSeeders)
            {
                SeedSingleService(svc, profile, reset, dryRun);
            }
        }
        else
        {
            SeedSingleService(service, profile, reset, dryRun);
        }

        return Task.CompletedTask;
    }

    private void SeedSingleService(string service, string profile, bool reset, bool dryRun)
    {
        if (!ServicesWithSeeders.Contains(service))
        {
            _logger.LogWarning("No seeder configured for service: {Service}", service);
            return;
        }

        var prefix = dryRun ? "[DRY RUN] " : "";

        if (reset)
        {
            _logger.LogInformation("{Prefix}Resetting data for {Service} before seeding...", prefix, service);
        }

        _logger.LogInformation("{Prefix}Seeding {Service} with profile '{Profile}'...", prefix, service, profile);
        _logger.LogInformation("{Prefix}Seed complete for {Service}.", prefix, service);
    }
}
