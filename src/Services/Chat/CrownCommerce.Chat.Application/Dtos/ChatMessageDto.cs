using CrownCommerce.Chat.Core.Enums;

namespace CrownCommerce.Chat.Application.Dtos;

public sealed record ChatMessageDto(
    Guid Id,
    MessageSender SenderType,
    string Content,
    DateTime SentAt);
