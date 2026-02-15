namespace CrownCommerce.Cli.Deploy.Services;

public interface IDeploymentService
{
    Task<bool> DeployServiceAsync(string name, string env);
    Task<bool> DeployFrontendAsync(string name, string env);
    Task<bool> GetStatusAsync(string env);
    Task<bool> DeployAllAsync(string env, bool dryRun);
}
