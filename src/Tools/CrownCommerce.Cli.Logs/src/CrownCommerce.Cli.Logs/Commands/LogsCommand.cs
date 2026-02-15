using System.CommandLine;
using CrownCommerce.Cli.Logs.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Logs.Commands;

public static class LogsCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var serviceOption = new Option<string[]>("--service", "Service names to tail (can be specified multiple times)")
        {
            AllowMultipleArgumentsPerToken = true,
        };
        var levelOption = new Option<string?>("--level", "Log level filter (e.g., error, warning, info)");
        var searchOption = new Option<string?>("--search", "Search text filter");
        var sinceOption = new Option<string?>("--since", "Time window (e.g., 1h, 30m)");
        var outputOption = new Option<string?>("--output", "Output file path");

        var rootCommand = new RootCommand("Crown Commerce Centralized Log Viewer")
        {
            serviceOption,
            levelOption,
            searchOption,
            sinceOption,
            outputOption,
        };

        rootCommand.SetHandler(async (string[] serviceValues, string? level, string? search, string? since, string? output) =>
        {
            var logService = services.GetRequiredService<ILogService>();
            var svcs = serviceValues.Length > 0 ? serviceValues : null;
            await logService.TailLogsAsync(svcs, level, search, since, output);
        }, serviceOption, levelOption, searchOption, sinceOption, outputOption);

        return rootCommand;
    }
}
