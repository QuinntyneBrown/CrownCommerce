using System.Diagnostics;
using System.Text.RegularExpressions;
using CrownCommerce.Cli.Seed.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Seed.Services;

public partial class SeederRunner : ISeederRunner
{
    private readonly ILogger<SeederRunner> _logger;

    public SeederRunner(ILogger<SeederRunner> logger)
    {
        _logger = logger;
    }

    public async Task<SeedResult> RunSeedAsync(string service, string profile, bool reset)
    {
        var pascalService = char.ToUpper(service[0]) + service[1..];
        var projectPath = $"src/Services/{pascalService}/CrownCommerce.{pascalService}.Api";

        var arguments = $"run --project {projectPath} -- seed --profile {profile}";
        if (reset)
        {
            arguments += " --reset";
        }

        _logger.LogInformation("Running: dotnet {Arguments}", arguments);

        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            if (process is null)
            {
                return new SeedResult(service, profile, false, 0, "Failed to start dotnet process");
            }

            var stdout = await process.StandardOutput.ReadToEndAsync();
            var stderr = await process.StandardError.ReadToEndAsync();

            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
            {
                var error = string.IsNullOrWhiteSpace(stderr) ? $"Process exited with code {process.ExitCode}" : stderr.Trim();
                _logger.LogError("Seed failed for {Service}: {Error}", service, error);
                return new SeedResult(service, profile, false, 0, error);
            }

            var recordsCreated = ParseRecordCount(stdout);
            _logger.LogInformation("Seed complete for {Service}: {Records} records created", service, recordsCreated);
            return new SeedResult(service, profile, true, recordsCreated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to run seeder for {Service}", service);
            return new SeedResult(service, profile, false, 0, ex.Message);
        }
    }

    private static int ParseRecordCount(string output)
    {
        var match = RecordCountRegex().Match(output);
        return match.Success && int.TryParse(match.Groups[1].Value, out var count) ? count : 0;
    }

    [GeneratedRegex(@"Records created:\s*(\d+)", RegexOptions.IgnoreCase)]
    private static partial Regex RecordCountRegex();
}
