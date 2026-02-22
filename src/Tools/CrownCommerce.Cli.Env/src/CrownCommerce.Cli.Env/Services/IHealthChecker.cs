namespace CrownCommerce.Cli.Env.Services;

public record HealthCheckResult(string ServiceName, int Port, bool IsHealthy, string? Error = null);

public interface IHealthChecker
{
    Task<HealthCheckResult> CheckAsync(string serviceName, int port);
}
