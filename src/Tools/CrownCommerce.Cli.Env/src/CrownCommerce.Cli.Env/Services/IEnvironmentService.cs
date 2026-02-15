namespace CrownCommerce.Cli.Env.Services;

public interface IEnvironmentService
{
    Task CheckHealthAsync(string env);
    Task ListDatabasesAsync();
    Task ListPortsAsync();
    Task StartAsync(string[]? services, string[]? frontends);
    Task StopAsync();
}
