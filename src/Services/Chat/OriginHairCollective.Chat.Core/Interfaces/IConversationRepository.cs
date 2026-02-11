using OriginHairCollective.Chat.Core.Entities;
using OriginHairCollective.Chat.Core.Enums;

namespace OriginHairCollective.Chat.Core.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Conversation?> GetByIdWithMessagesAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetBySessionIdAsync(string sessionId, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetByStatusAsync(ConversationStatus status, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetAllAsync(int skip = 0, int take = 50, CancellationToken ct = default);
    Task AddAsync(Conversation conversation, CancellationToken ct = default);
    Task UpdateAsync(Conversation conversation, CancellationToken ct = default);
    Task<int> GetCountAsync(CancellationToken ct = default);
    Task<int> GetCountByStatusAsync(ConversationStatus status, CancellationToken ct = default);
}
