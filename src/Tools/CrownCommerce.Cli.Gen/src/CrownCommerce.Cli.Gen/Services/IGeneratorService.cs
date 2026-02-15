namespace CrownCommerce.Cli.Gen.Services;

public interface IGeneratorService
{
    Task GenerateEntityAsync(string service, string entityName);
    Task GenerateConsumerAsync(string service, string eventName);
    Task GenerateServiceAsync(string serviceName);
    Task GeneratePageAsync(string app, string pageName);
}
