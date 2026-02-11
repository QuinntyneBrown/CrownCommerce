using OriginHairCollective.Chat.Core.Entities;

namespace OriginHairCollective.Chat.Core.Interfaces;

public interface IChatMessageRepository
{
    Task<IReadOnlyList<ChatMessage>> GetByConversationIdAsync(
        Guid conversationId, int skip = 0, int take = 50, CancellationToken ct = default);
    Task AddAsync(ChatMessage message, CancellationToken ct = default);
}
