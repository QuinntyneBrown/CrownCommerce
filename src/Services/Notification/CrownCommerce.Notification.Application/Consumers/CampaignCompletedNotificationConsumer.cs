using CrownCommerce.Notification.Core.Entities;
using CrownCommerce.Notification.Core.Enums;
using CrownCommerce.Notification.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Notification.Application.Consumers;

public sealed class CampaignCompletedNotificationConsumer(
    INotificationLogRepository repository,
    ILogger<CampaignCompletedNotificationConsumer> logger) : IConsumer<CampaignCompletedEvent>
{
    public async Task Consume(ConsumeContext<CampaignCompletedEvent> context)
    {
        var evt = context.Message;

        logger.LogInformation("Campaign {CampaignId} completed. Sent: {TotalSent}, Failed: {TotalFailed}",
            evt.CampaignId, evt.TotalSent, evt.TotalFailed);

        var log = new NotificationLog
        {
            Id = Guid.NewGuid(),
            Recipient = "system",
            Subject = $"Campaign Completed â€” {evt.TotalSent} sent, {evt.TotalFailed} failed",
            Type = NotificationType.NewsletterCampaign,
            Channel = NotificationChannel.System,
            ReferenceId = evt.CampaignId,
            IsSent = true,
            CreatedAt = DateTime.UtcNow,
            SentAt = DateTime.UtcNow
        };

        await repository.AddAsync(log);
    }
}
