using CrownCommerce.Notification.Core.Entities;
using CrownCommerce.Notification.Core.Enums;
using CrownCommerce.Notification.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Notification.Application.Consumers;

public sealed class PaymentCompletedNotificationConsumer(
    INotificationLogRepository repository,
    ILogger<PaymentCompletedNotificationConsumer> logger) : IConsumer<PaymentCompletedEvent>
{
    public async Task Consume(ConsumeContext<PaymentCompletedEvent> context)
    {
        var evt = context.Message;
        logger.LogInformation("Sending payment receipt to {Email} for Payment {PaymentId}", evt.CustomerEmail, evt.PaymentId);

        var log = new NotificationLog
        {
            Id = Guid.NewGuid(),
            Recipient = evt.CustomerEmail,
            Subject = $"Payment Receipt â€” ${evt.Amount:F2}",
            Type = NotificationType.PaymentReceipt,
            Channel = NotificationChannel.Email,
            ReferenceId = evt.PaymentId,
            IsSent = true,
            CreatedAt = DateTime.UtcNow,
            SentAt = DateTime.UtcNow
        };

        await repository.AddAsync(log);
    }
}
