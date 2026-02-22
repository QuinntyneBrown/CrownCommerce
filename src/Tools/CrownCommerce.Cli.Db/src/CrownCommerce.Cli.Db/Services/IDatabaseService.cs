using CrownCommerce.Cli.Db.Commands;

namespace CrownCommerce.Cli.Db.Services;

public interface IDatabaseService
{
    Task<string> GetConnectionStringAsync(string service, string env);
    Task<IReadOnlyList<DatabaseInfo>> ListDatabasesAsync();
    Task<bool> CheckHealthAsync(string? service);
    Task<bool> ResetDatabaseAsync(string service, string env);
}
