namespace CrownCommerce.Chat.Application.Dtos;

public sealed record ChatStatsDto(
    int TotalConversations,
    int ActiveConversations,
    double AvgMessagesPerConversation,
    int ConversationsToday);
