using OriginHairCollective.Chat.Core.Entities;
using OriginHairCollective.Chat.Core.Enums;
using OriginHairCollective.Chat.Core.Interfaces;
using OriginHairCollective.Chat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace OriginHairCollective.Chat.Infrastructure.Repositories;

public sealed class ConversationRepository(ChatDbContext context) : IConversationRepository
{
    public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<Conversation?> GetByIdWithMessagesAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .Include(c => c.Messages.OrderBy(m => m.SentAt))
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<IReadOnlyList<Conversation>> GetBySessionIdAsync(string sessionId, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .Where(c => c.SessionId == sessionId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Conversation>> GetByStatusAsync(ConversationStatus status, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .Where(c => c.Status == status)
            .OrderByDescending(c => c.LastMessageAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Conversation>> GetAllAsync(int skip = 0, int take = 50, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Conversation conversation, CancellationToken ct = default)
    {
        context.Conversations.Add(conversation);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Conversation conversation, CancellationToken ct = default)
    {
        context.Conversations.Update(conversation);
        await context.SaveChangesAsync(ct);
    }

    public async Task<int> GetCountAsync(CancellationToken ct = default)
    {
        return await context.Conversations.CountAsync(ct);
    }

    public async Task<int> GetCountByStatusAsync(ConversationStatus status, CancellationToken ct = default)
    {
        return await context.Conversations.CountAsync(c => c.Status == status, ct);
    }
}
