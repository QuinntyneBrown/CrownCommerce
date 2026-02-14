using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Scheduling.Application.Consumers;

public sealed class MeetingBookedNotificationConsumer(ILogger<MeetingBookedNotificationConsumer> logger)
    : IConsumer<MeetingBookedEvent>
{
    public Task Consume(ConsumeContext<MeetingBookedEvent> context)
    {
        var msg = context.Message;
        logger.LogInformation(
            "Meeting booked: {Title} at {StartTime} with {AttendeeCount} attendees. Email notifications queued for: {Emails}",
            msg.Title, msg.StartTimeUtc, msg.AttendeeEmails.Count, string.Join(", ", msg.AttendeeEmails));

        return Task.CompletedTask;
    }
}
