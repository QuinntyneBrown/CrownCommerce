using CrownCommerce.Notification.Core.Entities;
using CrownCommerce.Notification.Core.Interfaces;
using CrownCommerce.Notification.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Notification.Infrastructure.Repositories;

public sealed class NotificationLogRepository(NotificationDbContext context) : INotificationLogRepository
{
    public async Task<IReadOnlyList<NotificationLog>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.NotificationLogs
            .AsNoTracking()
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<NotificationLog>> GetByRecipientAsync(string recipient, CancellationToken ct = default)
    {
        return await context.NotificationLogs
            .AsNoTracking()
            .Where(n => n.Recipient == recipient)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<NotificationLog> AddAsync(NotificationLog log, CancellationToken ct = default)
    {
        context.NotificationLogs.Add(log);
        await context.SaveChangesAsync(ct);
        return log;
    }

    public async Task UpdateAsync(NotificationLog log, CancellationToken ct = default)
    {
        context.NotificationLogs.Update(log);
        await context.SaveChangesAsync(ct);
    }
}
