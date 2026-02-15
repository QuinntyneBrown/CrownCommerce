namespace CrownCommerce.Cli.Cron.Commands;

public record CronJobHistory(string JobName, DateTime ExecutedAt, string Status, string? Error = null);
