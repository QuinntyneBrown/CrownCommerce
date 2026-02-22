using CrownCommerce.Cli.Schedule.Commands;

namespace CrownCommerce.Cli.Schedule.Services;

public interface IScheduleStore
{
    Task<IReadOnlyList<Meeting>> GetMeetingsAsync(bool week, string? forEmail);
    Task AddMeetingAsync(Meeting meeting);
    Task<IReadOnlyList<Channel>> GetChannelsAsync(string? type);
    Task<IReadOnlyList<Availability>> GetAvailabilityAsync(string date);
}
