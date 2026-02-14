using CrownCommerce.Notification.Application.Dtos;

namespace CrownCommerce.Notification.Application.Services;

public interface INotificationService
{
    Task<IReadOnlyList<NotificationLogDto>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<NotificationLogDto>> GetByRecipientAsync(string recipient, CancellationToken ct = default);
}
