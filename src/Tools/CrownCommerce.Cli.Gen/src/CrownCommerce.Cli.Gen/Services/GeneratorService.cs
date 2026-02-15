using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Gen.Services;

public class GeneratorService : IGeneratorService
{
    private readonly ILogger<GeneratorService> _logger;

    public GeneratorService(ILogger<GeneratorService> logger)
    {
        _logger = logger;
    }

    public Task GenerateEntityAsync(string service, string entityName)
    {
        var pascalService = char.ToUpper(service[0]) + service[1..];

        _logger.LogInformation("Generating entity '{Entity}' for service '{Service}'...", entityName, service);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Core/Entities/{Entity}.cs",
            pascalService, pascalService, entityName);
        _logger.LogInformation("  Would update: src/Services/{Service}/CrownCommerce.{Service}.Infrastructure/Data/{Service}DbContext.cs",
            pascalService, pascalService, pascalService);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Api/Controllers/{Entity}Controller.cs",
            pascalService, pascalService, entityName);
        _logger.LogInformation("Entity scaffolding complete.");

        return Task.CompletedTask;
    }

    public Task GenerateConsumerAsync(string service, string eventName)
    {
        var pascalService = char.ToUpper(service[0]) + service[1..];

        _logger.LogInformation("Generating consumer for event '{Event}' in service '{Service}'...", eventName, service);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Application/Consumers/{Event}Consumer.cs",
            pascalService, pascalService, eventName);
        _logger.LogInformation("Consumer scaffolding complete.");

        return Task.CompletedTask;
    }

    public Task GenerateServiceAsync(string serviceName)
    {
        var pascalService = char.ToUpper(serviceName[0]) + serviceName[1..];

        _logger.LogInformation("Generating full service scaffold for '{Service}'...", serviceName);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Core/", pascalService, pascalService);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Infrastructure/", pascalService, pascalService);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Application/", pascalService, pascalService);
        _logger.LogInformation("  Would create: src/Services/{Service}/CrownCommerce.{Service}.Api/", pascalService, pascalService);
        _logger.LogInformation("Service scaffolding complete.");

        return Task.CompletedTask;
    }

    public Task GeneratePageAsync(string app, string pageName)
    {
        var kebabPage = string.Concat(pageName.Select((c, i) =>
            i > 0 && char.IsUpper(c) ? $"-{char.ToLower(c)}" : $"{char.ToLower(c)}"));

        _logger.LogInformation("Generating Angular page '{Page}' for app '{App}'...", pageName, app);
        _logger.LogInformation("  Would create: src/CrownCommerce.Web/projects/{App}/src/app/pages/{Page}/{Page}.component.ts",
            app, kebabPage, kebabPage);
        _logger.LogInformation("  Would create: src/CrownCommerce.Web/projects/{App}/src/app/pages/{Page}/{Page}.component.html",
            app, kebabPage, kebabPage);
        _logger.LogInformation("  Would create: src/CrownCommerce.Web/projects/{App}/src/app/pages/{Page}/{Page}.component.scss",
            app, kebabPage, kebabPage);
        _logger.LogInformation("Page scaffolding complete.");

        return Task.CompletedTask;
    }
}
