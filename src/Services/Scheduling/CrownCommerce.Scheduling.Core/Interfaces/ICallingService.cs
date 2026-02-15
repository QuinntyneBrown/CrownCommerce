namespace CrownCommerce.Scheduling.Core.Interfaces;

public interface ICallingService
{
    Task<CallRoom> CreateRoomAsync(string name, CancellationToken ct = default);
    Task<CallRoom?> GetRoomAsync(string name, CancellationToken ct = default);
    Task DeleteRoomAsync(string name, CancellationToken ct = default);
    Task<string> CreateMeetingTokenAsync(string roomName, string userName, bool isOwner = false, CancellationToken ct = default);
}

public sealed record CallRoom(string Name, string Url, DateTime CreatedAt, DateTime? ExpiresAt);
