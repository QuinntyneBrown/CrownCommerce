using System.Text.Json;
using CrownCommerce.Cli.Logs.Commands;

namespace CrownCommerce.Cli.Logs.Services;

public class LogSource : ILogSource
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly string _logsDirectory;

    public LogSource()
        : this(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".crowncommerce", "logs"))
    {
    }

    public LogSource(string logsDirectory)
    {
        _logsDirectory = logsDirectory;
    }

    public async Task<IReadOnlyList<LogEntry>> ReadLogsAsync(string[] services, string? since = null)
    {
        var cutoff = ParseSince(since);
        var entries = new List<LogEntry>();

        foreach (var service in services)
        {
            var logFile = Path.Combine(_logsDirectory, $"{service}.log");

            if (!File.Exists(logFile))
            {
                continue;
            }

            var lines = await File.ReadAllLinesAsync(logFile);

            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                try
                {
                    var entry = JsonSerializer.Deserialize<LogEntry>(line, JsonOptions);

                    if (entry is null)
                    {
                        continue;
                    }

                    if (cutoff.HasValue && entry.Timestamp < cutoff.Value)
                    {
                        continue;
                    }

                    entries.Add(entry);
                }
                catch (JsonException)
                {
                    // Skip malformed lines
                }
            }
        }

        return entries;
    }

    private static DateTime? ParseSince(string? since)
    {
        if (string.IsNullOrWhiteSpace(since))
        {
            return null;
        }

        var now = DateTime.UtcNow;
        var value = since.AsSpan();
        var unit = value[^1];
        if (int.TryParse(value[..^1], out var amount))
        {
            return unit switch
            {
                'h' => now.AddHours(-amount),
                'm' => now.AddMinutes(-amount),
                'd' => now.AddDays(-amount),
                _ => null,
            };
        }

        return null;
    }
}
