using System.Globalization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Db.Services;

public sealed class ConnectionStringProvider(
    IConfiguration configuration,
    ILogger<ConnectionStringProvider> logger) : IConnectionStringProvider
{
    public Task<string> GetConnectionStringAsync(string service, string env)
    {
        // Try configuration first (e.g. from appsettings.json or user secrets)
        var configKey = $"ConnectionStrings:{GetDatabaseName(service)}";
        var connectionString = configuration[configKey];

        if (!string.IsNullOrWhiteSpace(connectionString))
        {
            logger.LogDebug("Resolved connection string for {Service} from configuration", service);
            return Task.FromResult(connectionString);
        }

        // Fall back to convention-based connection string
        var dbName = GetDatabaseName(service);
        connectionString = env.ToLowerInvariant() switch
        {
            "development" => $"Server=(localdb)\\MSSQLLocalDB;Database={dbName};Trusted_Connection=True;TrustServerCertificate=True;",
            "staging" => $"Server=staging-db.crowncommerce.internal;Database={dbName};Trusted_Connection=True;TrustServerCertificate=True;Encrypt=True;",
            "production" => $"Server=prod-db.crowncommerce.internal;Database={dbName};Trusted_Connection=True;TrustServerCertificate=True;Encrypt=True;",
            _ => $"Server=(localdb)\\MSSQLLocalDB;Database={dbName};Trusted_Connection=True;TrustServerCertificate=True;",
        };

        logger.LogDebug("Built convention-based connection string for {Service} in {Env}", service, env);
        return Task.FromResult(connectionString);
    }

    private static string GetDatabaseName(string service)
    {
        var pascalCase = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(service.ToLowerInvariant());
        return $"CrownCommerce_{pascalCase}";
    }
}
