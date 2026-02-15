namespace CrownCommerce.Cli.Schedule.Commands;

public record Meeting(string Title, DateTime Start, string Duration, IReadOnlyList<string> Attendees, string? Location);
