using OriginHairCollective.Chat.Application.Dtos;
using OriginHairCollective.Chat.Core.Enums;

namespace OriginHairCollective.Chat.Application.Services;

public interface IChatService
{
    Task<ConversationDto> CreateConversationAsync(CreateConversationDto dto, CancellationToken ct = default);
    Task<ConversationDto?> GetConversationAsync(Guid id, CancellationToken ct = default);
    Task<ConversationDto?> GetConversationBySessionAsync(Guid id, string sessionId, CancellationToken ct = default);
    Task<IReadOnlyList<ConversationSummaryDto>> GetAllConversationsAsync(int skip = 0, int take = 50, CancellationToken ct = default);
    Task<ChatMessageDto> AddVisitorMessageAsync(Guid conversationId, string sessionId, string content, CancellationToken ct = default);
    Task<ChatMessageDto> AddAssistantMessageAsync(Guid conversationId, string content, int? tokensUsed, CancellationToken ct = default);
    Task<ChatStatsDto> GetStatsAsync(CancellationToken ct = default);
}
