namespace CrownCommerce.Cli.Seed.Commands;

public record SeedResult(string Service, string Profile, bool Success, int RecordsCreated, string? Error = null);
