using CrownCommerce.Cli.Schedule.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Schedule.Services;

public class ScheduleService : IScheduleService
{
    private static readonly List<Channel> Channels =
    [
        new("general", "public", 5),
        new("product-launches", "public", 4),
        new("engineering", "public", 3),
        new("hair-styling-tips", "public", 3),
        new("random", "public", 5),
        new("marketing", "public", 2),
        new("client-support", "public", 4),
    ];

    private readonly ILogger<ScheduleService> _logger;

    public ScheduleService(ILogger<ScheduleService> logger) => _logger = logger;

    public Task<IReadOnlyList<Meeting>> ListMeetingsAsync(bool week, string? forEmail)
    {
        var meetings = new List<Meeting>
        {
            new("Sprint Planning", DateTime.UtcNow.Date.AddHours(10), "1h",
                ["quinn@crowncommerce.io", "amara@crowncommerce.io"], "Zoom"),
            new("Product Review", DateTime.UtcNow.Date.AddHours(14), "30m",
                ["sophia@crowncommerce.io", "james@crowncommerce.io"], "Google Meet"),
            new("Styling Workshop", DateTime.UtcNow.Date.AddDays(1).AddHours(11), "2h",
                ["wanjiku@crowncommerce.io", "sophia@crowncommerce.io"], "Studio A"),
        };

        if (forEmail is not null)
        {
            meetings = meetings
                .Where(m => m.Attendees.Contains(forEmail, StringComparer.OrdinalIgnoreCase))
                .ToList();
        }

        if (!week)
        {
            meetings = meetings.Where(m => m.Start.Date == DateTime.UtcNow.Date).ToList();
        }

        return Task.FromResult<IReadOnlyList<Meeting>>(meetings);
    }

    public Task CreateMeetingAsync(CreateMeetingRequest request)
    {
        _logger.LogInformation(
            "Creating meeting '{Title}' starting at {Start} for {Duration} with {AttendeeCount} attendees. Location: {Location}",
            request.Title, request.Start, request.Duration, request.Attendees.Count,
            request.Location ?? "No location");
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Channel>> ListChannelsAsync(string? type)
    {
        var filtered = type is not null
            ? Channels.Where(c => c.Type.Equals(type, StringComparison.OrdinalIgnoreCase)).ToList()
            : Channels;

        return Task.FromResult<IReadOnlyList<Channel>>(filtered);
    }

    public Task<IReadOnlyList<Availability>> GetAvailabilityAsync(string date)
    {
        var availability = new List<Availability>
        {
            new("quinn@crowncommerce.io", "Quinn Brown", "America/Toronto", ["09:00-10:00", "13:00-15:00"]),
            new("amara@crowncommerce.io", "Amara Okafor", "Africa/Lagos", ["10:00-12:00", "14:00-16:00"]),
            new("wanjiku@crowncommerce.io", "Wanjiku Mwangi", "Africa/Lagos", ["09:00-11:00", "15:00-17:00"]),
            new("sophia@crowncommerce.io", "Sophia Chen", "America/Toronto", ["10:00-12:00", "14:00-17:00"]),
            new("james@crowncommerce.io", "James Wright", "Europe/London", ["08:00-10:00", "13:00-16:00"]),
        };

        return Task.FromResult<IReadOnlyList<Availability>>(availability);
    }
}
