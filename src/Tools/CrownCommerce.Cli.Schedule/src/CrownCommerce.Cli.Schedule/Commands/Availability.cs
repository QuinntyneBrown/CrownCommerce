namespace CrownCommerce.Cli.Schedule.Commands;

public record Availability(string Email, string Name, string TimeZone, IReadOnlyList<string> FreeSlots);
