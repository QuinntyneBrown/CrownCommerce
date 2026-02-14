namespace CrownCommerce.Chat.Application.Dtos;

public sealed record CreateConversationDto(string SessionId, string InitialMessage, string? VisitorName);
