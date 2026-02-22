namespace CrownCommerce.Cli.Logs.Commands;

public record LogEntry(DateTime Timestamp, string Level, string Service, string Message, string? Exception = null);
