using CrownCommerce.Notification.Core.Entities;
using CrownCommerce.Notification.Core.Enums;
using CrownCommerce.Notification.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Notification.Application.Consumers;

public sealed class InquiryReceivedNotificationConsumer(
    INotificationLogRepository repository,
    ILogger<InquiryReceivedNotificationConsumer> logger) : IConsumer<InquiryReceivedEvent>
{
    public async Task Consume(ConsumeContext<InquiryReceivedEvent> context)
    {
        var evt = context.Message;
        var type = evt.IsWholesale ? NotificationType.WholesaleFollowUp : NotificationType.InquiryAcknowledgment;
        var subject = evt.IsWholesale
            ? "Wholesale Inquiry Received â€” We'll Be in Touch"
            : "We Received Your Message â€” Origin Hair Collective";

        logger.LogInformation("Sending inquiry acknowledgment to {Email}", evt.CustomerEmail);

        var log = new NotificationLog
        {
            Id = Guid.NewGuid(),
            Recipient = evt.CustomerEmail,
            Subject = subject,
            Type = type,
            Channel = NotificationChannel.Email,
            ReferenceId = evt.InquiryId,
            IsSent = true,
            CreatedAt = DateTime.UtcNow,
            SentAt = DateTime.UtcNow
        };

        await repository.AddAsync(log);
    }
}
