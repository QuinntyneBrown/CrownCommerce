using CrownCommerce.Cli.Cron.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Cron.Services;

public class CronService : ICronService
{
    private readonly ICronJobStore _store;
    private readonly ICronJobRunner _runner;
    private readonly ILogger<CronService> _logger;

    public CronService(ICronJobStore store, ICronJobRunner runner, ILogger<CronService> logger)
    {
        _store = store;
        _runner = runner;
        _logger = logger;
    }

    public async Task<IReadOnlyList<CronJobDefinition>> ListJobsAsync()
    {
        return await _store.LoadJobsAsync();
    }

    public async Task<bool> RunJobAsync(string jobName)
    {
        var jobs = await _store.LoadJobsAsync();
        var job = jobs.FirstOrDefault(j => j.Name == jobName);

        if (job is null)
        {
            _logger.LogError("Job '{JobName}' not found", jobName);
            return false;
        }

        _logger.LogInformation("Running job '{JobName}'...", jobName);

        var (success, error) = await _runner.RunJobAsync(job);

        var history = new CronJobHistory(
            jobName,
            DateTime.UtcNow,
            success ? "Success" : "Failed",
            error
        );

        await _store.AppendHistoryAsync(history);

        if (!success)
        {
            _logger.LogWarning("Job '{JobName}' failed: {Error}", jobName, error);
        }

        return success;
    }

    public async Task StartDaemonAsync(string? jobFilter)
    {
        var jobs = await _store.LoadJobsAsync();

        var filtered = jobFilter is not null
            ? jobs.Where(j => j.Name == jobFilter).ToList()
            : jobs.ToList();

        _logger.LogInformation("Daemon started with {Count} job(s)", filtered.Count);

        foreach (var job in filtered)
        {
            _logger.LogInformation("  Scheduled: {JobName} [{Schedule}]", job.Name, job.Schedule);
        }
    }

    public async Task<IReadOnlyList<CronJobHistory>> GetHistoryAsync(string? jobName)
    {
        return await _store.LoadHistoryAsync(jobName);
    }
}
