namespace CrownCommerce.Shared.Contracts;

public sealed record MeetingCancelledEvent(
    Guid MeetingId,
    string Title,
    DateTime StartTimeUtc,
    IReadOnlyList<string> AttendeeEmails,
    DateTime OccurredAt);
