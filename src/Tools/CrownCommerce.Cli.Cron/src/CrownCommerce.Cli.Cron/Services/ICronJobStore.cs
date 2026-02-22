using CrownCommerce.Cli.Cron.Commands;

namespace CrownCommerce.Cli.Cron.Services;

public interface ICronJobStore
{
    Task<IReadOnlyList<CronJobDefinition>> LoadJobsAsync();
    Task SaveJobsAsync(IReadOnlyList<CronJobDefinition> jobs);
    Task<IReadOnlyList<CronJobHistory>> LoadHistoryAsync(string? jobName = null);
    Task AppendHistoryAsync(CronJobHistory entry);
}
