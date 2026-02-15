using System.CommandLine;
using System.CommandLine.Invocation;
using CrownCommerce.Cli.Email.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Email.Commands;

public static class EmailCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("cc-email - Email campaign and transactional mailer");

        rootCommand.AddCommand(CreateSendCommand(services));
        rootCommand.AddCommand(CreatePreviewCommand(services));
        rootCommand.AddCommand(CreateTemplatesCommand(services));
        rootCommand.AddCommand(CreateCampaignCommand(services));
        rootCommand.AddCommand(CreateServerCommand(services));

        return rootCommand;
    }

    private static Command CreateSendCommand(IServiceProvider services)
    {
        var toOption = new Option<string>("--to", "Recipient email address") { IsRequired = true };
        var templateOption = new Option<string>("--template", "Email template name") { IsRequired = true };
        var dataOption = new Option<string?>("--data", "Template data as JSON string");

        var command = new Command("send", "Send a transactional email") { toOption, templateOption, dataOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var to = context.ParseResult.GetValueForOption(toOption)!;
            var template = context.ParseResult.GetValueForOption(templateOption)!;
            var data = context.ParseResult.GetValueForOption(dataOption);

            var service = services.GetRequiredService<IEmailService>();
            await service.SendAsync(to, template, data);

            Console.WriteLine($"Email sent to {to} using template '{template}'.");
            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreatePreviewCommand(IServiceProvider services)
    {
        var templateArg = new Argument<string>("template", "The template to preview");
        var command = new Command("preview", "Preview an email template in the browser") { templateArg };

        command.SetHandler(async (InvocationContext context) =>
        {
            var template = context.ParseResult.GetValueForArgument(templateArg);
            var service = services.GetRequiredService<IEmailService>();
            var url = await service.PreviewAsync(template);

            Console.WriteLine($"Preview URL: {url}");
            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateTemplatesCommand(IServiceProvider services)
    {
        var command = new Command("templates", "List all available email templates");

        command.SetHandler(async (InvocationContext context) =>
        {
            var service = services.GetRequiredService<IEmailService>();
            var templates = await service.ListTemplatesAsync();

            Console.WriteLine($"{"Template",-25} {"Service",-15} {"Variables"}");
            Console.WriteLine(new string('-', 80));

            foreach (var t in templates)
            {
                Console.WriteLine($"{t.Name,-25} {t.Service,-15} {t.Variables}");
            }

            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateCampaignCommand(IServiceProvider services)
    {
        var subjectOption = new Option<string>("--subject", "Campaign subject line") { IsRequired = true };
        var templateOption = new Option<string>("--template", "Email template name") { IsRequired = true };
        var tagOption = new Option<string>("--tag", "Campaign tag for tracking") { IsRequired = true };
        var testToOption = new Option<string?>("--test-to", "Send a test to this email instead of all subscribers");

        var command = new Command("campaign", "Send a campaign email")
        {
            subjectOption, templateOption, tagOption, testToOption
        };

        command.SetHandler(async (InvocationContext context) =>
        {
            var subject = context.ParseResult.GetValueForOption(subjectOption)!;
            var template = context.ParseResult.GetValueForOption(templateOption)!;
            var tag = context.ParseResult.GetValueForOption(tagOption)!;
            var testTo = context.ParseResult.GetValueForOption(testToOption);

            var service = services.GetRequiredService<IEmailService>();
            await service.SendCampaignAsync(subject, template, tag, testTo);

            Console.WriteLine("Campaign dispatched.");
            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateServerCommand(IServiceProvider services)
    {
        var portOption = new Option<int>("--port", () => 1025, "SMTP server port");
        var command = new Command("server", "Start a local SMTP trap for testing") { portOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var port = context.ParseResult.GetValueForOption(portOption);
            var service = services.GetRequiredService<IEmailService>();
            await service.StartLocalServerAsync(port);

            Console.WriteLine($"Local SMTP trap running on port {port}.");
            context.ExitCode = 0;
        });

        return command;
    }
}
