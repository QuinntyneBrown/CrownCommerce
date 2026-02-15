using System.CommandLine;
using CrownCommerce.Cli.Gen.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Gen.Commands;

public static class GenCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("Crown Commerce Code Scaffolder");

        rootCommand.AddCommand(CreateEntityCommand(services));
        rootCommand.AddCommand(CreateConsumerCommand(services));
        rootCommand.AddCommand(CreateServiceCommand(services));
        rootCommand.AddCommand(CreatePageCommand(services));

        return rootCommand;
    }

    private static Command CreateEntityCommand(IServiceProvider services)
    {
        var serviceArg = new Argument<string>("service", "The target microservice name");
        var entityNameArg = new Argument<string>("entity-name", "The entity class name");

        var command = new Command("entity", "Generate an entity with controller and DbContext update")
        {
            serviceArg,
            entityNameArg,
        };

        command.SetHandler(async (string service, string entityName) =>
        {
            var generatorService = services.GetRequiredService<IGeneratorService>();
            await generatorService.GenerateEntityAsync(service, entityName);
        }, serviceArg, entityNameArg);

        return command;
    }

    private static Command CreateConsumerCommand(IServiceProvider services)
    {
        var serviceArg = new Argument<string>("service", "The target microservice name");
        var eventNameArg = new Argument<string>("event-name", "The event name for the consumer");

        var command = new Command("consumer", "Generate a MassTransit consumer for an event")
        {
            serviceArg,
            eventNameArg,
        };

        command.SetHandler(async (string service, string eventName) =>
        {
            var generatorService = services.GetRequiredService<IGeneratorService>();
            await generatorService.GenerateConsumerAsync(service, eventName);
        }, serviceArg, eventNameArg);

        return command;
    }

    private static Command CreateServiceCommand(IServiceProvider services)
    {
        var serviceNameArg = new Argument<string>("service-name", "The new service name to scaffold");

        var command = new Command("service", "Generate a full microservice scaffold")
        {
            serviceNameArg,
        };

        command.SetHandler(async (string serviceName) =>
        {
            var generatorService = services.GetRequiredService<IGeneratorService>();
            await generatorService.GenerateServiceAsync(serviceName);
        }, serviceNameArg);

        return command;
    }

    private static Command CreatePageCommand(IServiceProvider services)
    {
        var appArg = new Argument<string>("app", "The Angular application name");
        var pageNameArg = new Argument<string>("page-name", "The page component name");

        var command = new Command("page", "Generate an Angular page component")
        {
            appArg,
            pageNameArg,
        };

        command.SetHandler(async (string app, string pageName) =>
        {
            var generatorService = services.GetRequiredService<IGeneratorService>();
            await generatorService.GeneratePageAsync(app, pageName);
        }, appArg, pageNameArg);

        return command;
    }
}
