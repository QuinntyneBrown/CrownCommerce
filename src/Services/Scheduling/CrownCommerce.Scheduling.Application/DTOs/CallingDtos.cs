namespace CrownCommerce.Scheduling.Application.DTOs;

public sealed record CreateCallRoomRequest(string Name);

public sealed record CallRoomDto(string Name, string Url, DateTime CreatedAt, DateTime? ExpiresAt);

public sealed record JoinCallRequest(string RoomName, string UserName, bool IsOwner = false);

public sealed record CallTokenDto(string Token, string RoomUrl);
