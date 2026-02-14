using CrownCommerce.Notification.Application.Dtos;
using CrownCommerce.Notification.Core.Entities;

namespace CrownCommerce.Notification.Application.Mapping;

public static class NotificationMappingExtensions
{
    public static NotificationLogDto ToDto(this NotificationLog log) =>
        new(
            log.Id,
            log.Recipient,
            log.Subject,
            log.Type.ToString(),
            log.Channel.ToString(),
            log.ReferenceId,
            log.IsSent,
            log.ErrorMessage,
            log.CreatedAt,
            log.SentAt);
}
