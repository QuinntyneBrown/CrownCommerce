using CrownCommerce.Cli.Seed.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Seed.Services;

public class SeedService : ISeedService
{
    private readonly ILogger<SeedService> _logger;
    private readonly ISeederRunner _runner;

    public static readonly string[] ServicesWithSeeders =
    [
        "catalog", "content", "identity", "newsletter", "scheduling"
    ];

    public static readonly string[] SupportedProfiles =
    [
        "minimal", "demo", "load-test", "e2e"
    ];

    public SeedService(ILogger<SeedService> logger, ISeederRunner runner)
    {
        _logger = logger;
        _runner = runner;
    }

    public async Task SeedAsync(string service, string profile, bool reset, bool dryRun)
    {
        if (!SupportedProfiles.Contains(profile))
        {
            _logger.LogError("Unknown profile: {Profile}. Supported profiles: {Profiles}",
                profile, string.Join(", ", SupportedProfiles));
            return;
        }

        if (dryRun)
        {
            LogDryRun(service, profile, reset);
            return;
        }

        if (service == "all")
        {
            var results = new List<SeedResult>();
            foreach (var svc in ServicesWithSeeders)
            {
                var result = await _runner.RunSeedAsync(svc, profile, reset);
                results.Add(result);
            }

            DisplayResults(results);
        }
        else
        {
            if (!ServicesWithSeeders.Contains(service))
            {
                _logger.LogWarning("No seeder configured for service: {Service}", service);
                return;
            }

            var result = await _runner.RunSeedAsync(service, profile, reset);
            DisplayResults([result]);
        }
    }

    private void LogDryRun(string service, string profile, bool reset)
    {
        var services = service == "all" ? ServicesWithSeeders : [service];
        foreach (var svc in services)
        {
            if (!ServicesWithSeeders.Contains(svc))
            {
                _logger.LogWarning("[DRY RUN] No seeder configured for service: {Service}", svc);
                continue;
            }

            if (reset)
            {
                _logger.LogInformation("[DRY RUN] Would reset data for {Service}", svc);
            }

            _logger.LogInformation("[DRY RUN] Would seed {Service} with profile '{Profile}'", svc, profile);
        }
    }

    private void DisplayResults(List<SeedResult> results)
    {
        _logger.LogInformation("");
        _logger.LogInformation("╔══════════════╦══════════╦═════════╦═════════════════╗");
        _logger.LogInformation("║ Service      ║ Profile  ║ Status  ║ Records Created ║");
        _logger.LogInformation("╠══════════════╬══════════╬═════════╬═════════════════╣");

        foreach (var r in results)
        {
            var status = r.Success ? "OK" : "FAIL";
            _logger.LogInformation("║ {Service,-12} ║ {Profile,-8} ║ {Status,-7} ║ {Records,15} ║",
                r.Service, r.Profile, status, r.RecordsCreated);

            if (!r.Success && r.Error is not null)
            {
                _logger.LogError("  Error: {Error}", r.Error);
            }
        }

        _logger.LogInformation("╚══════════════╩══════════╩═════════╩═════════════════╝");

        var total = results.Sum(r => r.RecordsCreated);
        var failed = results.Count(r => !r.Success);
        _logger.LogInformation("Total: {Total} records created, {Failed} failures", total, failed);
    }
}
