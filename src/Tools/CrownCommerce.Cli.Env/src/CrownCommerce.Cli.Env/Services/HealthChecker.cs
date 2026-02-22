namespace CrownCommerce.Cli.Env.Services;

public class HealthChecker : IHealthChecker
{
    private readonly IHttpClientFactory _httpClientFactory;

    public HealthChecker(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<HealthCheckResult> CheckAsync(string serviceName, int port)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(5);

            var response = await client.GetAsync($"http://localhost:{port}/health");

            if (response.IsSuccessStatusCode)
            {
                return new HealthCheckResult(serviceName, port, IsHealthy: true);
            }

            return new HealthCheckResult(
                serviceName,
                port,
                IsHealthy: false,
                Error: $"HTTP {(int)response.StatusCode} {response.ReasonPhrase}");
        }
        catch (Exception ex)
        {
            return new HealthCheckResult(
                serviceName,
                port,
                IsHealthy: false,
                Error: ex.Message);
        }
    }
}
