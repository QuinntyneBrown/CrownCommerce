using CrownCommerce.Chat.Core.Enums;

namespace CrownCommerce.Chat.Application.Dtos;

public sealed record ConversationDto(
    Guid Id,
    string? VisitorName,
    ConversationStatus Status,
    DateTime CreatedAt,
    DateTime? LastMessageAt,
    int MessageCount,
    IReadOnlyList<ChatMessageDto> Messages);
