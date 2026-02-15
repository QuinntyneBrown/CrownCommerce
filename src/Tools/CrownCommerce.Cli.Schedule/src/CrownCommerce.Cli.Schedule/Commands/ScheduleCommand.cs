using System.CommandLine;
using System.CommandLine.Invocation;
using CrownCommerce.Cli.Schedule.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CrownCommerce.Cli.Schedule.Commands;

public static class ScheduleCommand
{
    public static RootCommand Create(IServiceProvider services)
    {
        var rootCommand = new RootCommand("cc-schedule - Meeting and schedule manager with timezone support");

        rootCommand.AddCommand(CreateMeetingsCommand(services));
        rootCommand.AddCommand(CreateCreateMeetingCommand(services));
        rootCommand.AddCommand(CreateChannelsCommand(services));
        rootCommand.AddCommand(CreateAvailabilityCommand(services));

        return rootCommand;
    }

    private static Command CreateMeetingsCommand(IServiceProvider services)
    {
        var weekOption = new Option<bool>("--week", "Show meetings for the entire week");
        var forOption = new Option<string?>("--for", "Filter meetings for a specific attendee email");

        var command = new Command("meetings", "List scheduled meetings") { weekOption, forOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var week = context.ParseResult.GetValueForOption(weekOption);
            var forEmail = context.ParseResult.GetValueForOption(forOption);

            var service = services.GetRequiredService<IScheduleService>();
            var meetings = await service.ListMeetingsAsync(week, forEmail);

            Console.WriteLine($"{"Title",-25} {"Start",-22} {"Duration",-10} {"Location",-15} {"Attendees"}");
            Console.WriteLine(new string('-', 100));

            foreach (var m in meetings)
            {
                Console.WriteLine($"{m.Title,-25} {m.Start:u,-22} {m.Duration,-10} {m.Location ?? "",-15} {string.Join(", ", m.Attendees)}");
            }

            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateCreateMeetingCommand(IServiceProvider services)
    {
        var titleOption = new Option<string>("--title", "Meeting title") { IsRequired = true };
        var startOption = new Option<string>("--start", "Start date/time (ISO 8601)") { IsRequired = true };
        var durationOption = new Option<string>("--duration", () => "1h", "Duration (e.g., 30m, 1h, 2h)");
        var attendeesOption = new Option<string>("--attendees", "Comma-separated attendee emails") { IsRequired = true };
        var locationOption = new Option<string?>("--location", "Meeting location or link");

        var command = new Command("create-meeting", "Create a new meeting")
        {
            titleOption, startOption, durationOption, attendeesOption, locationOption
        };

        command.SetHandler(async (InvocationContext context) =>
        {
            var attendeesRaw = context.ParseResult.GetValueForOption(attendeesOption)!;
            var attendees = attendeesRaw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            var request = new CreateMeetingRequest(
                Title: context.ParseResult.GetValueForOption(titleOption)!,
                Start: context.ParseResult.GetValueForOption(startOption)!,
                Duration: context.ParseResult.GetValueForOption(durationOption)!,
                Attendees: attendees,
                Location: context.ParseResult.GetValueForOption(locationOption)
            );

            var service = services.GetRequiredService<IScheduleService>();
            await service.CreateMeetingAsync(request);

            Console.WriteLine($"Meeting '{request.Title}' created for {request.Start}.");
            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateChannelsCommand(IServiceProvider services)
    {
        var typeOption = new Option<string?>("--type", "Filter by channel type (public or dm)");
        var command = new Command("channels", "List communication channels") { typeOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var type = context.ParseResult.GetValueForOption(typeOption);
            var service = services.GetRequiredService<IScheduleService>();
            var channels = await service.ListChannelsAsync(type);

            Console.WriteLine($"{"Channel",-25} {"Type",-10} {"Members"}");
            Console.WriteLine(new string('-', 50));

            foreach (var c in channels)
            {
                Console.WriteLine($"{c.Name,-25} {c.Type,-10} {c.MemberCount}");
            }

            context.ExitCode = 0;
        });

        return command;
    }

    private static Command CreateAvailabilityCommand(IServiceProvider services)
    {
        var dateOption = new Option<string>("--date", "Date to check availability (yyyy-MM-dd)") { IsRequired = true };
        var command = new Command("availability", "Show team availability for a date") { dateOption };

        command.SetHandler(async (InvocationContext context) =>
        {
            var date = context.ParseResult.GetValueForOption(dateOption)!;
            var service = services.GetRequiredService<IScheduleService>();
            var availability = await service.GetAvailabilityAsync(date);

            Console.WriteLine($"Availability for {date}:");
            Console.WriteLine();

            foreach (var a in availability)
            {
                Console.WriteLine($"  {a.Name} ({a.TimeZone}):");
                foreach (var slot in a.FreeSlots)
                {
                    Console.WriteLine($"    - {slot}");
                }
            }

            context.ExitCode = 0;
        });

        return command;
    }
}
