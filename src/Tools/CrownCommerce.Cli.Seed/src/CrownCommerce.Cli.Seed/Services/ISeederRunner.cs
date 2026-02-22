using CrownCommerce.Cli.Seed.Commands;

namespace CrownCommerce.Cli.Seed.Services;

public interface ISeederRunner
{
    Task<SeedResult> RunSeedAsync(string service, string profile, bool reset);
}
