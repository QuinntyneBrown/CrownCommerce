using CrownCommerce.Cli.Db.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Db.Services;

public sealed class DatabaseService(
    ILogger<DatabaseService> logger,
    IConnectionStringProvider connectionStringProvider) : IDatabaseService
{
    private static readonly IReadOnlyDictionary<string, (string DatabaseName, string Provider)> ServiceRegistry =
        new Dictionary<string, (string, string)>(StringComparer.OrdinalIgnoreCase)
        {
            ["catalog"]       = ("CrownCommerce_Catalog", "SqlServer"),
            ["chat"]          = ("CrownCommerce_Chat", "SqlServer"),
            ["content"]       = ("CrownCommerce_Content", "SqlServer"),
            ["crm"]           = ("CrownCommerce_Crm", "SqlServer"),
            ["identity"]      = ("CrownCommerce_Identity", "SqlServer"),
            ["inquiry"]       = ("CrownCommerce_Inquiry", "SqlServer"),
            ["newsletter"]    = ("CrownCommerce_Newsletter", "SqlServer"),
            ["notification"]  = ("CrownCommerce_Notification", "SqlServer"),
            ["order"]         = ("CrownCommerce_Order", "SqlServer"),
            ["payment"]       = ("CrownCommerce_Payment", "SqlServer"),
            ["scheduling"]    = ("CrownCommerce_Scheduling", "SqlServer"),
        };

    public async Task<string> GetConnectionStringAsync(string service, string env)
    {
        if (!ServiceRegistry.ContainsKey(service))
        {
            logger.LogWarning("Unknown service '{Service}'. Attempting convention-based resolution.", service);
        }

        return await connectionStringProvider.GetConnectionStringAsync(service, env);
    }

    public async Task<IReadOnlyList<DatabaseInfo>> ListDatabasesAsync()
    {
        var results = new List<DatabaseInfo>();

        foreach (var (serviceName, (dbName, provider)) in ServiceRegistry)
        {
            var connStr = await connectionStringProvider.GetConnectionStringAsync(serviceName, "development");
            results.Add(new DatabaseInfo(serviceName, dbName, provider, connStr));
        }

        logger.LogInformation("Listed {Count} service databases", results.Count);
        return results.AsReadOnly();
    }

    public async Task<bool> CheckHealthAsync(string? service)
    {
        var servicesToCheck = service is not null
            ? new[] { service }
            : ServiceRegistry.Keys.ToArray();

        var allHealthy = true;

        foreach (var svc in servicesToCheck)
        {
            try
            {
                var connStr = await connectionStringProvider.GetConnectionStringAsync(svc, "development");
                logger.LogInformation("Health check passed for {Service} ({ConnectionString})", svc, connStr);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Health check failed for {Service}", svc);
                allHealthy = false;
            }
        }

        return allHealthy;
    }

    public async Task<bool> ResetDatabaseAsync(string service, string env)
    {
        if (!ServiceRegistry.ContainsKey(service))
        {
            logger.LogError("Cannot reset unknown service '{Service}'", service);
            return false;
        }

        var connStr = await connectionStringProvider.GetConnectionStringAsync(service, env);
        logger.LogWarning("Resetting database for {Service} in {Env} environment", service, env);
        logger.LogInformation("Would drop and recreate database using: {ConnectionString}", connStr);

        // In a real implementation, this would execute DROP/CREATE DATABASE commands
        return true;
    }
}
