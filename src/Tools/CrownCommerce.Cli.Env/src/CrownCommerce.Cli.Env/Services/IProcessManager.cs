namespace CrownCommerce.Cli.Env.Services;

public interface IProcessManager
{
    Task<bool> StartAsync(string name, string command, string arguments);
    Task StopAllAsync();
    IReadOnlyList<string> GetRunningProcesses();
}
