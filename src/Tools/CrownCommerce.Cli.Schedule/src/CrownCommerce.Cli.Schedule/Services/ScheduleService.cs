using CrownCommerce.Cli.Schedule.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Schedule.Services;

public class ScheduleService : IScheduleService
{
    private readonly ILogger<ScheduleService> _logger;
    private readonly IScheduleStore _store;

    public ScheduleService(ILogger<ScheduleService> logger, IScheduleStore store)
    {
        _logger = logger;
        _store = store;
    }

    public async Task<IReadOnlyList<Meeting>> ListMeetingsAsync(bool week, string? forEmail)
    {
        _logger.LogDebug("Listing meetings (week={Week}, forEmail={ForEmail})", week, forEmail);
        return await _store.GetMeetingsAsync(week, forEmail);
    }

    public async Task CreateMeetingAsync(CreateMeetingRequest request)
    {
        _logger.LogInformation(
            "Creating meeting '{Title}' starting at {Start} for {Duration} with {AttendeeCount} attendees. Location: {Location}",
            request.Title, request.Start, request.Duration, request.Attendees.Count,
            request.Location ?? "No location");

        var start = DateTime.Parse(request.Start).ToUniversalTime();
        var duration = request.Duration ?? "1h";

        var meeting = new Meeting(
            Title: request.Title,
            Start: start,
            Duration: duration,
            Attendees: request.Attendees,
            Location: request.Location);

        await _store.AddMeetingAsync(meeting);
    }

    public async Task<IReadOnlyList<Channel>> ListChannelsAsync(string? type)
    {
        _logger.LogDebug("Listing channels (type={Type})", type);
        return await _store.GetChannelsAsync(type);
    }

    public async Task<IReadOnlyList<Availability>> GetAvailabilityAsync(string date)
    {
        _logger.LogDebug("Getting availability for date={Date}", date);
        return await _store.GetAvailabilityAsync(date);
    }
}
