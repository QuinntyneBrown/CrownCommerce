using CrownCommerce.Cli.Cron.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Cron.Services;

public class CronService : ICronService
{
    private static readonly List<CronJobDefinition> Jobs =
    [
        new("clear-expired-carts", "*/30 * * * *", "order", "Remove cart items older than 24 hours"),
        new("send-follow-up-reminders", "0 9 * * *", "crm", "Email contacts with overdue follow-ups"),
        new("send-meeting-reminders", "*/15 * * * *", "scheduling", "Notify attendees 15 min before meetings"),
        new("daily-subscriber-digest", "0 8 * * *", "newsletter", "Send daily digest to subscribers"),
        new("sync-employee-presence", "*/5 * * * *", "scheduling", "Update presence based on last activity"),
        new("cleanup-notification-logs", "0 2 * * *", "notification", "Archive logs older than 90 days"),
    ];

    private readonly ILogger<CronService> _logger;

    public CronService(ILogger<CronService> logger) => _logger = logger;

    public Task<IReadOnlyList<CronJobDefinition>> ListJobsAsync()
    {
        return Task.FromResult<IReadOnlyList<CronJobDefinition>>(Jobs);
    }

    public Task<bool> RunJobAsync(string jobName)
    {
        var job = Jobs.Find(j => j.Name == jobName);
        if (job is null)
        {
            _logger.LogError("Job '{JobName}' not found", jobName);
            return Task.FromResult(false);
        }

        _logger.LogInformation("Executing {JobName}...", jobName);
        return Task.FromResult(true);
    }

    public Task StartDaemonAsync(string? jobFilter)
    {
        var filtered = jobFilter is not null
            ? Jobs.Where(j => j.Name == jobFilter).ToList()
            : Jobs;

        _logger.LogInformation("Daemon started with {Count} jobs", filtered.Count);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<CronJobHistory>> GetHistoryAsync(string? jobName)
    {
        var history = new List<CronJobHistory>();

        if (jobName is not null)
        {
            history.Add(new CronJobHistory(jobName, DateTime.UtcNow.AddHours(-1), "Success"));
        }
        else
        {
            foreach (var job in Jobs)
            {
                history.Add(new CronJobHistory(job.Name, DateTime.UtcNow.AddHours(-1), "Success"));
            }
        }

        return Task.FromResult<IReadOnlyList<CronJobHistory>>(history);
    }
}
