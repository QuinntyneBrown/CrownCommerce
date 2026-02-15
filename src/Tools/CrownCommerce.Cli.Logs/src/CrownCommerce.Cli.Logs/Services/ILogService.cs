namespace CrownCommerce.Cli.Logs.Services;

public interface ILogService
{
    Task TailLogsAsync(string[]? services, string? level, string? search, string? since, string? output);
}
