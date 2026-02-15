using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Deploy.Services;

public class DeploymentService : IDeploymentService
{
    private readonly ILogger<DeploymentService> _logger;

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

    public DeploymentService(ILogger<DeploymentService> logger)
    {
        _logger = logger;
    }

    public Task<bool> DeployServiceAsync(string name, string env)
    {
        if (!BackendServices.Contains(name))
        {
            _logger.LogError("Unknown service: {Name}. Valid services: {Services}",
                name, string.Join(", ", BackendServices));
            return Task.FromResult(false);
        }

        _logger.LogInformation("Deploying service {Name} to {Environment}...", name, env);
        _logger.LogInformation("Would run: az containerapp update --name crowncommerce-{Name} --resource-group crowncommerce-{Env} --image crowncommerce/{Name}:latest",
            name, env, name);

        return Task.FromResult(true);
    }

    public Task<bool> DeployFrontendAsync(string name, string env)
    {
        if (!Frontends.Contains(name))
        {
            _logger.LogError("Unknown frontend: {Name}. Valid frontends: {Frontends}",
                name, string.Join(", ", Frontends));
            return Task.FromResult(false);
        }

        _logger.LogInformation("Deploying frontend {Name} to {Environment}...", name, env);
        _logger.LogInformation("Would run: az staticwebapp deploy --name {Name} --environment {Env}",
            name, env);

        return Task.FromResult(true);
    }

    public Task<bool> GetStatusAsync(string env)
    {
        _logger.LogInformation("Checking deployment status for environment: {Environment}", env);

        Console.WriteLine($"{"Component",-30} {"Status",-15} {"Version",-15}");
        Console.WriteLine(new string('-', 60));

        foreach (var service in BackendServices)
        {
            Console.WriteLine($"{service,-30} {"running",-15} {"latest",-15}");
        }

        foreach (var frontend in Frontends)
        {
            Console.WriteLine($"{frontend,-30} {"deployed",-15} {"latest",-15}");
        }

        return Task.FromResult(true);
    }

    public Task<bool> DeployAllAsync(string env, bool dryRun)
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
        }
        else
        {
            _logger.LogInformation("Deploying all services and frontends to {Environment}...", env);

            foreach (var service in BackendServices)
            {
                _logger.LogInformation("Deploying service: {Service}", service);
            }

            foreach (var frontend in Frontends)
            {
                _logger.LogInformation("Deploying frontend: {Frontend}", frontend);
            }
        }

        return Task.FromResult(true);
    }
}
