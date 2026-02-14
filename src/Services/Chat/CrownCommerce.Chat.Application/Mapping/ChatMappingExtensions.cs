using CrownCommerce.Chat.Application.Dtos;
using CrownCommerce.Chat.Core.Entities;

namespace CrownCommerce.Chat.Application.Mapping;

public static class ChatMappingExtensions
{
    public static ChatMessageDto ToDto(this ChatMessage message) =>
        new(
            message.Id,
            message.SenderType,
            message.Content,
            message.SentAt);

    public static ConversationDto ToDto(this Conversation conversation) =>
        new(
            conversation.Id,
            conversation.VisitorName,
            conversation.Status,
            conversation.CreatedAt,
            conversation.LastMessageAt,
            conversation.MessageCount,
            conversation.Messages.Select(m => m.ToDto()).ToList());

    public static ConversationSummaryDto ToSummaryDto(this Conversation conversation) =>
        new(
            conversation.Id,
            conversation.VisitorName,
            conversation.Status,
            conversation.CreatedAt,
            conversation.LastMessageAt,
            conversation.MessageCount);
}
