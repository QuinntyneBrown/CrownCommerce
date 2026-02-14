using CrownCommerce.Chat.Core.Entities;
using CrownCommerce.Chat.Core.Interfaces;
using CrownCommerce.Chat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Chat.Infrastructure.Repositories;

public sealed class ChatMessageRepository(ChatDbContext context) : IChatMessageRepository
{
    public async Task<IReadOnlyList<ChatMessage>> GetByConversationIdAsync(
        Guid conversationId, int skip = 0, int take = 50, CancellationToken ct = default)
    {
        return await context.ChatMessages
            .AsNoTracking()
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(ct);
    }

    public async Task AddAsync(ChatMessage message, CancellationToken ct = default)
    {
        context.ChatMessages.Add(message);
        await context.SaveChangesAsync(ct);
    }
}
