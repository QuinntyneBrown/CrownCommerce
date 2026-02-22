namespace CrownCommerce.Cli.Db.Services;

public interface IConnectionStringProvider
{
    Task<string> GetConnectionStringAsync(string service, string env);
}
