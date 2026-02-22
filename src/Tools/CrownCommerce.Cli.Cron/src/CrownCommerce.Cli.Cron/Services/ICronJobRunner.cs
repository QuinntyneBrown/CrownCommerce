using CrownCommerce.Cli.Cron.Commands;

namespace CrownCommerce.Cli.Cron.Services;

public interface ICronJobRunner
{
    Task<(bool Success, string? Error)> RunJobAsync(CronJobDefinition job);
}
