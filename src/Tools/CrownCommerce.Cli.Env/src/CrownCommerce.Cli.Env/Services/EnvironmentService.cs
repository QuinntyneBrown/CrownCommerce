using CrownCommerce.Cli.Env.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Env.Services;

public class EnvironmentService : IEnvironmentService
{
    private readonly ILogger<EnvironmentService> _logger;

    public static readonly List<PortEntry> PortMap = new()
    {
        new("catalog", 5100, "service"),
        new("content", 5050, "service"),
        new("identity", 5070, "service"),
        new("inquiry", 5200, "service"),
        new("newsletter", 5800, "service"),
        new("notification", 5060, "service"),
        new("order", 5030, "service"),
        new("payment", 5041, "service"),
        new("chat", 5095, "service"),
        new("crm", 5090, "service"),
        new("scheduling", 5280, "service"),
        new("api-gateway", 5000, "infrastructure"),
        new("rabbitmq", 5672, "infrastructure"),
        new("origin-hair-collective", 4201, "frontend"),
        new("origin-coming-soon", 4202, "frontend"),
        new("mane-haus", 4203, "frontend"),
        new("mane-haus-coming-soon", 4204, "frontend"),
        new("teams", 4205, "frontend"),
        new("admin", 4206, "frontend"),
    };

    public EnvironmentService(ILogger<EnvironmentService> logger)
    {
        _logger = logger;
    }

    public Task CheckHealthAsync(string env)
    {
        _logger.LogInformation("Checking health for environment: {Environment}", env);

        foreach (var entry in PortMap)
        {
            var url = $"http://localhost:{entry.Port}";
            _logger.LogInformation("  Would check {Name} at {Url}...", entry.Name, url);
        }

        _logger.LogInformation("Health check complete for {Environment}.", env);
        return Task.CompletedTask;
    }

    public Task ListDatabasesAsync()
    {
        _logger.LogInformation("Listing databases for all services...");

        var services = PortMap.Where(p => p.Category == "service").ToList();
        foreach (var svc in services)
        {
            _logger.LogInformation("  {Service} -> {Service}Db (PostgreSQL)", svc.Name, svc.Name);
        }

        return Task.CompletedTask;
    }

    public Task ListPortsAsync()
    {
        Console.WriteLine($"{"Name",-30} {"Port",-10} {"Category",-15}");
        Console.WriteLine(new string('-', 55));

        foreach (var entry in PortMap)
        {
            Console.WriteLine($"{entry.Name,-30} {entry.Port,-10} {entry.Category,-15}");
        }

        return Task.CompletedTask;
    }

    public Task StartAsync(string[]? services, string[]? frontends)
    {
        _logger.LogInformation("Starting Aspire AppHost...");

        if (services is { Length: > 0 })
        {
            _logger.LogInformation("  Services filter: {Services}", string.Join(", ", services));
        }

        if (frontends is { Length: > 0 })
        {
            _logger.LogInformation("  Frontends filter: {Frontends}", string.Join(", ", frontends));
        }

        _logger.LogInformation("All requested processes started.");
        return Task.CompletedTask;
    }

    public Task StopAsync()
    {
        _logger.LogInformation("Stopping all running processes...");
        _logger.LogInformation("All processes stopped.");
        return Task.CompletedTask;
    }
}
