using CrownCommerce.Cli.Cron.Commands;

namespace CrownCommerce.Cli.Cron.Services;

public interface ICronService
{
    Task<IReadOnlyList<CronJobDefinition>> ListJobsAsync();
    Task<bool> RunJobAsync(string jobName);
    Task StartDaemonAsync(string? jobFilter);
    Task<IReadOnlyList<CronJobHistory>> GetHistoryAsync(string? jobName);
}
