using CrownCommerce.Cli.Migrate.Commands;

namespace CrownCommerce.Cli.Migrate.Services;

public interface IMigrationService
{
    Task AddMigrationAsync(string service, string name);
    Task ApplyMigrationsAsync(string service, string env);
    Task<IReadOnlyList<MigrationStatus>> GetStatusAsync(string env);
}
