using CrownCommerce.Cli.Schedule.Commands;

namespace CrownCommerce.Cli.Schedule.Services;

public interface IScheduleService
{
    Task<IReadOnlyList<Meeting>> ListMeetingsAsync(bool week, string? forEmail);
    Task CreateMeetingAsync(CreateMeetingRequest request);
    Task<IReadOnlyList<Channel>> ListChannelsAsync(string? type);
    Task<IReadOnlyList<Availability>> GetAvailabilityAsync(string date);
}
