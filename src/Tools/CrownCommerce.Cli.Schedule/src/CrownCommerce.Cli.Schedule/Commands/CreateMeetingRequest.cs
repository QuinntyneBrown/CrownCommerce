namespace CrownCommerce.Cli.Schedule.Commands;

public record CreateMeetingRequest(
    string Title,
    string Start,
    string Duration,
    IReadOnlyList<string> Attendees,
    string? Location);
