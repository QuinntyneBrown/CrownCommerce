using CrownCommerce.Notification.Core.Entities;

namespace CrownCommerce.Notification.Core.Interfaces;

public interface INotificationLogRepository
{
    Task<IReadOnlyList<NotificationLog>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<NotificationLog>> GetByRecipientAsync(string recipient, CancellationToken ct = default);
    Task<NotificationLog> AddAsync(NotificationLog log, CancellationToken ct = default);
    Task UpdateAsync(NotificationLog log, CancellationToken ct = default);
}
