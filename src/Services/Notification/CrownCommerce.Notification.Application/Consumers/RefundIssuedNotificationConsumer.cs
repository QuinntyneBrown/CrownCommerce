using CrownCommerce.Notification.Core.Entities;
using CrownCommerce.Notification.Core.Enums;
using CrownCommerce.Notification.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Notification.Application.Consumers;

public sealed class RefundIssuedNotificationConsumer(
    INotificationLogRepository repository,
    ILogger<RefundIssuedNotificationConsumer> logger) : IConsumer<RefundIssuedEvent>
{
    public async Task Consume(ConsumeContext<RefundIssuedEvent> context)
    {
        var evt = context.Message;
        logger.LogInformation("Sending refund confirmation to {Email} for Refund {RefundId}", evt.CustomerEmail, evt.RefundId);

        var log = new NotificationLog
        {
            Id = Guid.NewGuid(),
            Recipient = evt.CustomerEmail,
            Subject = $"Refund Confirmation â€” ${evt.Amount:F2}",
            Type = NotificationType.RefundConfirmation,
            Channel = NotificationChannel.Email,
            ReferenceId = evt.RefundId,
            IsSent = true,
            CreatedAt = DateTime.UtcNow,
            SentAt = DateTime.UtcNow
        };

        await repository.AddAsync(log);
    }
}
