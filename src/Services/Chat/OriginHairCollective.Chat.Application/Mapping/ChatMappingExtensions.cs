using OriginHairCollective.Chat.Application.Dtos;
using OriginHairCollective.Chat.Core.Entities;

namespace OriginHairCollective.Chat.Application.Mapping;

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
