using OriginHairCollective.Chat.Core.Enums;

namespace OriginHairCollective.Chat.Application.Dtos;

public sealed record ChatMessageDto(
    Guid Id,
    MessageSender SenderType,
    string Content,
    DateTime SentAt);
