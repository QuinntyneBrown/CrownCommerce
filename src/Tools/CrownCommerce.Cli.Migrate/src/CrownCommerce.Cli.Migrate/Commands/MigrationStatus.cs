namespace CrownCommerce.Cli.Migrate.Commands;

public record MigrationStatus(string ServiceName, int AppliedCount, int PendingCount);
