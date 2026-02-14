namespace CrownCommerce.Shared.Contracts;

public sealed record MeetingBookedEvent(
    Guid MeetingId,
    string Title,
    DateTime StartTimeUtc,
    DateTime EndTimeUtc,
    string? Location,
    string OrganizerEmail,
    string OrganizerName,
    IReadOnlyList<string> AttendeeEmails,
    DateTime OccurredAt);
