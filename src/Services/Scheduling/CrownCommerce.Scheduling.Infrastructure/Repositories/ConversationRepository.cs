using CrownCommerce.Scheduling.Core.Entities;
using CrownCommerce.Scheduling.Core.Enums;
using CrownCommerce.Scheduling.Core.Interfaces;
using CrownCommerce.Scheduling.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Scheduling.Infrastructure.Repositories;

public sealed class ConversationRepository(SchedulingDbContext context) : IConversationRepository
{
    public async Task<ScheduleConversation?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Conversations
            .Include(c => c.Messages.OrderBy(m => m.SentAt))
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<IReadOnlyList<ScheduleConversation>> GetByEmployeeAsync(Guid employeeId, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .Include(c => c.Participants)
            .Where(c => c.CreatedByEmployeeId == employeeId
                || c.Participants.Any(p => p.EmployeeId == employeeId))
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<ScheduleConversation>> GetByMeetingAsync(Guid meetingId, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .Include(c => c.Messages.OrderBy(m => m.SentAt))
            .Include(c => c.Participants)
            .Where(c => c.MeetingId == meetingId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<ScheduleConversation>> GetRecentAsync(int count = 20, CancellationToken ct = default)
    {
        return await context.Conversations
            .AsNoTracking()
            .Include(c => c.Participants)
            .Where(c => c.Status == ConversationStatus.Active)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .Take(count)
            .ToListAsync(ct);
    }

    public async Task AddAsync(ScheduleConversation conversation, CancellationToken ct = default)
    {
        context.Conversations.Add(conversation);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ScheduleConversation conversation, CancellationToken ct = default)
    {
        context.Conversations.Update(conversation);
        await context.SaveChangesAsync(ct);
    }

    public async Task AddMessageAsync(ConversationMessage message, CancellationToken ct = default)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(ct);

        context.ConversationMessages.Add(message);

        var conversation = await context.Conversations.FindAsync([message.ConversationId], ct);
        if (conversation is not null)
        {
            conversation.LastMessageAt = message.SentAt;
        }

        await context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
    }
}
