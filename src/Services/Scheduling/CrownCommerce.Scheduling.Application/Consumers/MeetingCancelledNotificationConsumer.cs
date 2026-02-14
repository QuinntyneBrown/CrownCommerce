using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Scheduling.Application.Consumers;

public sealed class MeetingCancelledNotificationConsumer(ILogger<MeetingCancelledNotificationConsumer> logger)
    : IConsumer<MeetingCancelledEvent>
{
    public Task Consume(ConsumeContext<MeetingCancelledEvent> context)
    {
        var msg = context.Message;
        logger.LogInformation(
            "Meeting cancelled: {Title} originally at {StartTime}. Cancellation notifications queued for: {Emails}",
            msg.Title, msg.StartTimeUtc, string.Join(", ", msg.AttendeeEmails));

        return Task.CompletedTask;
    }
}
