using System.Globalization;
using CrownCommerce.Cli.Env.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Env.Services;

public class EnvironmentService : IEnvironmentService
{
    private readonly ILogger<EnvironmentService> _logger;
    private readonly IHealthChecker _healthChecker;
    private readonly IProcessManager _processManager;

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

    public EnvironmentService(
        ILogger<EnvironmentService> logger,
        IHealthChecker healthChecker,
        IProcessManager processManager)
    {
        _logger = logger;
        _healthChecker = healthChecker;
        _processManager = processManager;
    }

    public async Task CheckHealthAsync(string env)
    {
        _logger.LogInformation("Checking health for environment: {Environment}", env);

        Console.WriteLine($"{"Name",-30} {"Port",-10} {"Status",-10} {"Error",-40}");
        Console.WriteLine(new string('-', 90));

        foreach (var entry in PortMap)
        {
            var result = await _healthChecker.CheckAsync(entry.Name, entry.Port);

            var status = result.IsHealthy ? "Healthy" : "Unhealthy";
            var error = result.Error ?? "";

            Console.WriteLine($"{result.ServiceName,-30} {result.Port,-10} {status,-10} {error,-40}");
        }

        _logger.LogInformation("Health check complete for {Environment}.", env);
    }

    public Task ListDatabasesAsync()
    {
        _logger.LogInformation("Listing databases for all services...");

        Console.WriteLine($"{"Service",-30} {"Database",-40}");
        Console.WriteLine(new string('-', 70));

        var services = PortMap.Where(p => p.Category == "service").ToList();
        foreach (var svc in services)
        {
            var dbName = $"CrownCommerce_{ToPascalCase(svc.Name)}";
            Console.WriteLine($"{svc.Name,-30} {dbName,-40}");
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

    public async Task StartAsync(string[]? services, string[]? frontends)
    {
        _logger.LogInformation("Starting services...");

        var entriesToStart = GetFilteredEntries(services, frontends);

        foreach (var entry in entriesToStart)
        {
            var command = entry.Category == "frontend" ? "ng" : "dotnet";
            var arguments = entry.Category == "frontend"
                ? $"serve {entry.Name} --port {entry.Port}"
                : $"run --project src/Services/{ToPascalCase(entry.Name)}/CrownCommerce.{ToPascalCase(entry.Name)}.Api --urls http://localhost:{entry.Port}";

            var started = await _processManager.StartAsync(entry.Name, command, arguments);
            if (started)
            {
                _logger.LogInformation("Started {Name} on port {Port}", entry.Name, entry.Port);
            }
            else
            {
                _logger.LogWarning("Failed to start {Name}", entry.Name);
            }
        }

        _logger.LogInformation("All requested processes started.");
    }

    public async Task StopAsync()
    {
        _logger.LogInformation("Stopping all running processes...");
        await _processManager.StopAllAsync();
        _logger.LogInformation("All processes stopped.");
    }

    internal static List<PortEntry> GetFilteredEntries(string[]? services, string[]? frontends)
    {
        if (services is null or { Length: 0 } && frontends is null or { Length: 0 })
        {
            return PortMap.ToList();
        }

        var result = new List<PortEntry>();

        if (services is { Length: > 0 })
        {
            result.AddRange(PortMap.Where(p =>
                (p.Category == "service" || p.Category == "infrastructure") &&
                services.Contains(p.Name, StringComparer.OrdinalIgnoreCase)));
        }

        if (frontends is { Length: > 0 })
        {
            result.AddRange(PortMap.Where(p =>
                p.Category == "frontend" &&
                frontends.Contains(p.Name, StringComparer.OrdinalIgnoreCase)));
        }

        return result;
    }

    internal static string ToPascalCase(string name)
    {
        var textInfo = CultureInfo.InvariantCulture.TextInfo;
        var parts = name.Split('-');
        return string.Join("", parts.Select(p => textInfo.ToTitleCase(p)));
    }
}
