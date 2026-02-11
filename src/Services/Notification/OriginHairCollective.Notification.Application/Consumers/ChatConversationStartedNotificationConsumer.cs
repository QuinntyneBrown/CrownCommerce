using OriginHairCollective.Notification.Core.Entities;
using OriginHairCollective.Notification.Core.Enums;
using OriginHairCollective.Notification.Core.Interfaces;
using OriginHairCollective.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace OriginHairCollective.Notification.Application.Consumers;

public sealed class ChatConversationStartedNotificationConsumer(
    INotificationLogRepository repository,
    ILogger<ChatConversationStartedNotificationConsumer> logger) : IConsumer<ChatConversationStartedEvent>
{
    public async Task Consume(ConsumeContext<ChatConversationStartedEvent> context)
    {
        var evt = context.Message;

        logger.LogInformation(
            "Chat conversation started — ConversationId: {ConversationId}, Visitor: {VisitorName}",
            evt.ConversationId,
            evt.VisitorName ?? "Anonymous");

        var log = new NotificationLog
        {
            Id = Guid.NewGuid(),
            Recipient = evt.VisitorName ?? "Anonymous Visitor",
            Subject = "Chat Conversation Started",
            Type = NotificationType.ChatConversationStarted,
            Channel = NotificationChannel.System,
            ReferenceId = evt.ConversationId,
            IsSent = true,
            CreatedAt = DateTime.UtcNow,
            SentAt = DateTime.UtcNow
        };

        await repository.AddAsync(log);
    }
}
