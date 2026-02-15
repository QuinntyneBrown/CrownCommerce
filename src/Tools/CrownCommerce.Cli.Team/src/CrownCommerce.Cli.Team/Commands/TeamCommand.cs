using System.CommandLine;
using System.CommandLine.Invocation;
using CrownCommerce.Cli.Team.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Team.Commands;

public static class TeamCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("cc-team - Team member management across Identity and Scheduling");

        rootCommand.AddCommand(CreateListCommand(services));
        rootCommand.AddCommand(CreateAddCommand(services));
        rootCommand.AddCommand(CreateShowCommand(services));
        rootCommand.AddCommand(CreateDeactivateCommand(services));

        return rootCommand;
    }

    private static Command CreateListCommand(IServiceProvider services)
    {
        var departmentOption = new Option<string?>("--department", "Filter by department");
        var statusOption = new Option<string>("--status", () => "active", "Filter by status");

        var command = new Command("list", "List team members") { departmentOption, statusOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var department = context.ParseResult.GetValueForOption(departmentOption);
            var status = context.ParseResult.GetValueForOption(statusOption)!;

            var service = services.GetRequiredService<ITeamService>();
            var members = await service.ListAsync(department, status);

            Console.WriteLine($"{"Email",-35} {"Name",-20} {"Role",-12} {"Department",-15} {"TimeZone",-20} {"Status"}");
            Console.WriteLine(new string('-', 115));

            foreach (var m in members)
            {
                Console.WriteLine($"{m.Email,-35} {m.FirstName + " " + m.LastName,-20} {m.Role,-12} {m.Department,-15} {m.TimeZone,-20} {m.Status}");
            }

            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateAddCommand(IServiceProvider services)
    {
        var emailOption = new Option<string>("--email", "Email address") { IsRequired = true };
        var firstNameOption = new Option<string>("--first-name", "First name") { IsRequired = true };
        var lastNameOption = new Option<string>("--last-name", "Last name") { IsRequired = true };
        var roleOption = new Option<string>("--role", () => "Customer", "Role (Admin, Customer, etc.)");
        var jobTitleOption = new Option<string?>("--job-title", "Job title");
        var departmentOption = new Option<string?>("--department", "Department");
        var timezoneOption = new Option<string>("--timezone", () => "America/Toronto", "IANA timezone");

        var command = new Command("add", "Add a new team member")
        {
            emailOption, firstNameOption, lastNameOption, roleOption,
            jobTitleOption, departmentOption, timezoneOption
        };

        command.SetHandler(async (InvocationContext context) =>
        {
            var request = new TeamMemberRequest(
                Email: context.ParseResult.GetValueForOption(emailOption)!,
                FirstName: context.ParseResult.GetValueForOption(firstNameOption)!,
                LastName: context.ParseResult.GetValueForOption(lastNameOption)!,
                Role: context.ParseResult.GetValueForOption(roleOption)!,
                JobTitle: context.ParseResult.GetValueForOption(jobTitleOption),
                Department: context.ParseResult.GetValueForOption(departmentOption),
                TimeZone: context.ParseResult.GetValueForOption(timezoneOption)!
            );

            var service = services.GetRequiredService<ITeamService>();
            await service.AddAsync(request);

            Console.WriteLine($"Team member {request.FirstName} {request.LastName} added.");
            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateShowCommand(IServiceProvider services)
    {
        var emailArg = new Argument<string>("email", "Email of the team member to show");
        var command = new Command("show", "Show details for a team member") { emailArg };

        command.SetHandler(async (InvocationContext context) =>
        {
            var email = context.ParseResult.GetValueForArgument(emailArg);
            var service = services.GetRequiredService<ITeamService>();
            var member = await service.GetAsync(email);

            if (member is null)
            {
                Console.Error.WriteLine($"Team member '{email}' not found.");
                context.ExitCode = 1;
                return;
            }

            Console.WriteLine($"Email:      {member.Email}");
            Console.WriteLine($"Name:       {member.FirstName} {member.LastName}");
            Console.WriteLine($"Role:       {member.Role}");
            Console.WriteLine($"Department: {member.Department}");
            Console.WriteLine($"TimeZone:   {member.TimeZone}");
            Console.WriteLine($"Status:     {member.Status}");
            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateDeactivateCommand(IServiceProvider services)
    {
        var emailArg = new Argument<string>("email", "Email of the team member to deactivate");
        var command = new Command("deactivate", "Deactivate a team member") { emailArg };

        command.SetHandler(async (InvocationContext context) =>
        {
            var email = context.ParseResult.GetValueForArgument(emailArg);
            var service = services.GetRequiredService<ITeamService>();
            await service.DeactivateAsync(email);

            Console.WriteLine($"Team member '{email}' has been deactivated.");
            context.ExitCode = 0;
        });

        return command;
    }
}
