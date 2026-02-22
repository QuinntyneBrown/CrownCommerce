using CrownCommerce.Cli.Logs.Commands;

namespace CrownCommerce.Cli.Logs.Services;

public interface ILogSource
{
    Task<IReadOnlyList<LogEntry>> ReadLogsAsync(string[] services, string? since = null);
}
