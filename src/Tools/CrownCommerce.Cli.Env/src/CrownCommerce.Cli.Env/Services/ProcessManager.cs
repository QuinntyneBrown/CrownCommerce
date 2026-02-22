using System.Collections.Concurrent;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Env.Services;

public class ProcessManager : IProcessManager
{
    private readonly ILogger<ProcessManager> _logger;
    private readonly ConcurrentDictionary<string, Process> _processes = new();

    public ProcessManager(ILogger<ProcessManager> logger)
    {
        _logger = logger;
    }

    public Task<bool> StartAsync(string name, string command, string arguments)
    {
        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = command,
                Arguments = arguments,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
            };

            var process = new Process { StartInfo = startInfo };
            process.Start();

            _processes[name] = process;
            _logger.LogInformation("Started {Name} (PID: {Pid})", name, process.Id);
            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start {Name}", name);
            return Task.FromResult(false);
        }
    }

    public Task StopAllAsync()
    {
        foreach (var (name, process) in _processes)
        {
            try
            {
                if (!process.HasExited)
                {
                    process.Kill(entireProcessTree: true);
                    _logger.LogInformation("Stopped {Name} (PID: {Pid})", name, process.Id);
                }

                process.Dispose();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error stopping {Name}", name);
            }
        }

        _processes.Clear();
        return Task.CompletedTask;
    }

    public IReadOnlyList<string> GetRunningProcesses()
    {
        return _processes
            .Where(kvp => !kvp.Value.HasExited)
            .Select(kvp => kvp.Key)
            .ToList()
            .AsReadOnly();
    }
}
