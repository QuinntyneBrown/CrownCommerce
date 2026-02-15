namespace CrownCommerce.Cli.Cron.Commands;

public record CronJobDefinition(string Name, string Schedule, string TargetService, string Description);
