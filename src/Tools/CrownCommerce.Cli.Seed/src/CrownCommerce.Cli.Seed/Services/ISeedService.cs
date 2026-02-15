namespace CrownCommerce.Cli.Seed.Services;

public interface ISeedService
{
    Task SeedAsync(string service, string profile, bool reset, bool dryRun);
}
