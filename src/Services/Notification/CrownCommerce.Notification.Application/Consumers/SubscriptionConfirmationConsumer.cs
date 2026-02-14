using CrownCommerce.Notification.Core.Entities;
using CrownCommerce.Notification.Core.Enums;
using CrownCommerce.Notification.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Notification.Application.Consumers;

public sealed class SubscriptionConfirmationConsumer(
    INotificationLogRepository repository,
    ILogger<SubscriptionConfirmationConsumer> logger) : IConsumer<SubscriptionRequestedEvent>
{
    public async Task Consume(ConsumeContext<SubscriptionRequestedEvent> context)
    {
        var evt = context.Message;

        logger.LogInformation("Sending newsletter confirmation email to {Email}", evt.Email);

        var log = new NotificationLog
        {
            Id = Guid.NewGuid(),
            Recipient = evt.Email,
            Subject = "Confirm Your Subscription â€” Origin Hair Collective",
            Type = NotificationType.NewsletterConfirmation,
            Channel = NotificationChannel.Email,
            ReferenceId = evt.SubscriberId,
            IsSent = true,
            CreatedAt = DateTime.UtcNow,
            SentAt = DateTime.UtcNow
        };

        await repository.AddAsync(log);
    }
}
