using CrownCommerce.Cli.Migrate.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Migrate.Services;

public class MigrationService : IMigrationService
{
    private readonly ILogger<MigrationService> _logger;
    private readonly IProcessRunner _processRunner;

    public static readonly Dictionary<string, ServiceRegistryEntry> ServiceRegistry = new()
    {
        ["catalog"] = new("src/Services/Catalog/CrownCommerce.Catalog.Infrastructure", "CatalogDbContext"),
        ["chat"] = new("src/Services/Chat/CrownCommerce.Chat.Infrastructure", "ChatDbContext"),
        ["content"] = new("src/Services/Content/CrownCommerce.Content.Infrastructure", "ContentDbContext"),
        ["crm"] = new("src/Services/Crm/CrownCommerce.Crm.Infrastructure", "CrmDbContext"),
        ["identity"] = new("src/Services/Identity/CrownCommerce.Identity.Infrastructure", "IdentityDbContext"),
        ["inquiry"] = new("src/Services/Inquiry/CrownCommerce.Inquiry.Infrastructure", "InquiryDbContext"),
        ["newsletter"] = new("src/Services/Newsletter/CrownCommerce.Newsletter.Infrastructure", "NewsletterDbContext"),
        ["notification"] = new("src/Services/Notification/CrownCommerce.Notification.Infrastructure", "NotificationDbContext"),
        ["order"] = new("src/Services/Order/CrownCommerce.Order.Infrastructure", "OrderDbContext"),
        ["payment"] = new("src/Services/Payment/CrownCommerce.Payment.Infrastructure", "PaymentDbContext"),
        ["scheduling"] = new("src/Services/Scheduling/CrownCommerce.Scheduling.Infrastructure", "SchedulingDbContext"),
    };

    public MigrationService(ILogger<MigrationService> logger, IProcessRunner processRunner)
    {
        _logger = logger;
        _processRunner = processRunner;
    }

    public async Task AddMigrationAsync(string service, string name)
    {
        if (!ServiceRegistry.TryGetValue(service, out var entry))
        {
            _logger.LogError("Unknown service: {Service}. Valid services: {Services}",
                service, string.Join(", ", ServiceRegistry.Keys));
            return;
        }

        _logger.LogInformation("Adding migration '{Name}' to {Service}...", name, service);

        var arguments = $"ef migrations add {name} --project {entry.InfrastructureProjectPath} --context {entry.DbContextName}";
        var result = await _processRunner.RunAsync("dotnet", arguments);

        if (result.ExitCode != 0)
        {
            _logger.LogError("Migration add failed: {Error}", result.Error);
        }
        else
        {
            _logger.LogInformation("Migration added successfully. {Output}", result.Output);
        }
    }

    public async Task ApplyMigrationsAsync(string service, string env)
    {
        if (!ServiceRegistry.TryGetValue(service, out var entry))
        {
            _logger.LogError("Unknown service: {Service}. Valid services: {Services}",
                service, string.Join(", ", ServiceRegistry.Keys));
            return;
        }

        _logger.LogInformation("Applying migrations for {Service} in {Environment}...", service, env);

        var arguments = $"ef database update --project {entry.InfrastructureProjectPath} --context {entry.DbContextName}";
        var result = await _processRunner.RunAsync("dotnet", arguments);

        if (result.ExitCode != 0)
        {
            _logger.LogError("Migration apply failed: {Error}", result.Error);
        }
        else
        {
            _logger.LogInformation("Migrations applied successfully. {Output}", result.Output);
        }
    }

    public async Task<IReadOnlyList<MigrationStatus>> GetStatusAsync(string env)
    {
        _logger.LogInformation("Checking migration status for environment: {Environment}", env);

        var statuses = new List<MigrationStatus>();

        foreach (var (service, entry) in ServiceRegistry)
        {
            var arguments = $"ef migrations list --project {entry.InfrastructureProjectPath} --context {entry.DbContextName}";
            var result = await _processRunner.RunAsync("dotnet", arguments);

            var appliedCount = 0;
            var pendingCount = 0;

            if (result.ExitCode == 0)
            {
                var lines = result.Output
                    .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                    .Select(l => l.Trim())
                    .Where(l => !string.IsNullOrWhiteSpace(l))
                    .ToList();

                foreach (var line in lines)
                {
                    if (line.Contains("(Pending)"))
                        pendingCount++;
                    else
                        appliedCount++;
                }
            }

            statuses.Add(new MigrationStatus(service, appliedCount, pendingCount));
        }

        return statuses;
    }
}
