using CrownCommerce.Cli.Deploy.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Deploy.Services;

public class DeploymentService : IDeploymentService
{
    private readonly ILogger<DeploymentService> _logger;
    private readonly IProcessRunner _processRunner;

    public static readonly string[] BackendServices =
    [
        "catalog", "chat", "content", "crm", "identity",
        "inquiry", "newsletter", "notification", "order",
        "payment", "scheduling"
    ];

    public static readonly string[] Frontends =
    [
        "origin-hair-collective", "mane-haus", "crown-commerce-admin"
    ];

    public DeploymentService(ILogger<DeploymentService> logger, IProcessRunner processRunner)
    {
        _logger = logger;
        _processRunner = processRunner;
    }

    public async Task<bool> DeployServiceAsync(string name, string env)
    {
        if (!BackendServices.Contains(name))
        {
            _logger.LogError("Unknown service: {Name}. Valid services: {Services}",
                name, string.Join(", ", BackendServices));
            return false;
        }

        _logger.LogInformation("Deploying service {Name} to {Environment}...", name, env);

        var result = await _processRunner.RunAsync("az",
            $"containerapp update --name crowncommerce-{name} --resource-group crowncommerce-{env} --image crowncommerce/{name}:latest");

        if (result.ExitCode != 0)
        {
            _logger.LogError("Failed to deploy service {Name}: {Error}", name, result.Error);
            return false;
        }

        _logger.LogInformation("Successfully deployed service {Name} to {Environment}", name, env);
        return true;
    }

    public async Task<bool> DeployFrontendAsync(string name, string env)
    {
        if (!Frontends.Contains(name))
        {
            _logger.LogError("Unknown frontend: {Name}. Valid frontends: {Frontends}",
                name, string.Join(", ", Frontends));
            return false;
        }

        _logger.LogInformation("Deploying frontend {Name} to {Environment}...", name, env);

        var result = await _processRunner.RunAsync("az",
            $"staticwebapp deploy --name {name} --environment {env}");

        if (result.ExitCode != 0)
        {
            _logger.LogError("Failed to deploy frontend {Name}: {Error}", name, result.Error);
            return false;
        }

        _logger.LogInformation("Successfully deployed frontend {Name} to {Environment}", name, env);
        return true;
    }

    public async Task<bool> GetStatusAsync(string env)
    {
        _logger.LogInformation("Checking deployment status for environment: {Environment}", env);

        var containerResult = await _processRunner.RunAsync("az",
            $"containerapp list --resource-group crowncommerce-{env} --output json");

        var staticResult = await _processRunner.RunAsync("az",
            $"staticwebapp list --resource-group crowncommerce-{env} --output json");

        var statuses = new List<DeploymentStatus>();

        foreach (var service in BackendServices)
        {
            var status = containerResult.ExitCode == 0 ? "running" : "unknown";
            statuses.Add(new DeploymentStatus(service, "service", status, "latest", env));
        }

        foreach (var frontend in Frontends)
        {
            var status = staticResult.ExitCode == 0 ? "deployed" : "unknown";
            statuses.Add(new DeploymentStatus(frontend, "frontend", status, "latest", env));
        }

        Console.WriteLine($"{"Component",-30} {"Type",-12} {"Status",-15} {"Version",-15} {"Environment",-15}");
        Console.WriteLine(new string('-', 87));

        foreach (var s in statuses)
        {
            Console.WriteLine($"{s.Component,-30} {s.Type,-12} {s.Status,-15} {s.Version,-15} {s.Environment,-15}");
        }

        return true;
    }

    public async Task<bool> DeployAllAsync(string env, bool dryRun)
    {
        if (dryRun)
        {
            _logger.LogInformation("[DRY RUN] Would deploy all services and frontends to {Environment}", env);

            foreach (var service in BackendServices)
            {
                _logger.LogInformation("[DRY RUN] Would deploy service: {Service}", service);
            }

            foreach (var frontend in Frontends)
            {
                _logger.LogInformation("[DRY RUN] Would deploy frontend: {Frontend}", frontend);
            }

            return true;
        }

        _logger.LogInformation("Deploying all services and frontends to {Environment}...", env);

        var allSuccess = true;

        foreach (var service in BackendServices)
        {
            var success = await DeployServiceAsync(service, env);
            if (!success)
            {
                allSuccess = false;
            }
        }

        foreach (var frontend in Frontends)
        {
            var success = await DeployFrontendAsync(frontend, env);
            if (!success)
            {
                allSuccess = false;
            }
        }

        return allSuccess;
    }
}
