using CrownCommerce.Cli.Cron.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Cron.Services;

public class CronJobRunner : ICronJobRunner
{
    private static readonly Dictionary<string, int> ServicePorts = new()
    {
        ["order"] = 5010,
        ["crm"] = 5020,
        ["scheduling"] = 5030,
        ["newsletter"] = 5040,
        ["notification"] = 5050,
    };

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<CronJobRunner> _logger;

    public CronJobRunner(IHttpClientFactory httpClientFactory, ILogger<CronJobRunner> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<(bool Success, string? Error)> RunJobAsync(CronJobDefinition job)
    {
        var port = ServicePorts.GetValueOrDefault(job.TargetService, 5000);
        var url = $"http://localhost:{port}/api/jobs/{job.Name}/run";

        _logger.LogInformation("Executing job '{JobName}' via POST {Url}", job.Name, url);

        try
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.PostAsync(url, null);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Job '{JobName}' completed successfully", job.Name);
                return (true, null);
            }

            var error = $"HTTP {(int)response.StatusCode} {response.ReasonPhrase}";
            _logger.LogWarning("Job '{JobName}' failed: {Error}", job.Name, error);
            return (false, error);
        }
        catch (HttpRequestException ex)
        {
            var error = $"Connection error: {ex.Message}";
            _logger.LogError(ex, "Job '{JobName}' failed with connection error", job.Name);
            return (false, error);
        }
        catch (TaskCanceledException ex)
        {
            var error = $"Request timed out: {ex.Message}";
            _logger.LogError(ex, "Job '{JobName}' timed out", job.Name);
            return (false, error);
        }
    }
}
