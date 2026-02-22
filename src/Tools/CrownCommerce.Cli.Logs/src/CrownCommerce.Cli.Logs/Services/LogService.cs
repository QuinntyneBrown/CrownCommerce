using CrownCommerce.Cli.Logs.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Logs.Services;

public class LogService : ILogService
{
    private readonly ILogger<LogService> _logger;
    private readonly ILogSource _logSource;

    public static readonly string[] AllServices =
    {
        "catalog", "content", "identity", "inquiry", "newsletter",
        "notification", "order", "payment", "chat", "crm", "scheduling"
    };

    public LogService(ILogger<LogService> logger, ILogSource logSource)
    {
        _logger = logger;
        _logSource = logSource;
    }

    public async Task TailLogsAsync(string[]? services, string? level, string? search, string? since, string? output)
    {
        var targetServices = services is { Length: > 0 } ? services : AllServices;

        _logger.LogDebug("Tailing logs from {Count} services", targetServices.Length);

        var entries = await _logSource.ReadLogsAsync(targetServices, since);

        var filtered = entries.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(level))
        {
            filtered = filtered.Where(e =>
                e.Level.Equals(level, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            filtered = filtered.Where(e =>
                e.Message.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        var sorted = filtered.OrderBy(e => e.Timestamp).ToList();

        var lines = new List<string>();

        foreach (var entry in sorted)
        {
            var formatted = $"[{entry.Timestamp:HH:mm:ss}] [{entry.Level}] [{entry.Service}] {entry.Message}";
            lines.Add(formatted);

            if (entry.Exception is not null)
            {
                lines.Add($"  {entry.Exception}");
            }
        }

        foreach (var line in lines)
        {
            Console.WriteLine(line);
        }

        if (!string.IsNullOrWhiteSpace(output))
        {
            var directory = Path.GetDirectoryName(output);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            await File.WriteAllLinesAsync(output, lines);
        }

        if (sorted.Count == 0)
        {
            Console.WriteLine("No log entries found matching the specified filters.");
        }
    }
}
