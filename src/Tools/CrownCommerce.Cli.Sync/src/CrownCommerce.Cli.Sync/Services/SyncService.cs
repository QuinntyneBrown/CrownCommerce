using System.Text.RegularExpressions;
using CrownCommerce.Cli.Sync.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Sync.Services;

public class SyncService : ISyncService
{
    private readonly ILogger<SyncService> _logger;
    private readonly IHandoffStore _handoffStore;
    private readonly ITeamDirectory _teamDirectory;

    public SyncService(ILogger<SyncService> logger, IHandoffStore handoffStore, ITeamDirectory teamDirectory)
    {
        _logger = logger;
        _handoffStore = handoffStore;
        _teamDirectory = teamDirectory;
    }

    public async Task ShowTeamStatusAsync()
    {
        var members = await _teamDirectory.GetMembersAsync();

        Console.WriteLine($"{"Name",-15} {"Local Time",-25} {"Timezone",-25} {"Status",-20}");
        Console.WriteLine(new string('-', 85));

        foreach (var member in members)
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById(member.WindowsTimezone);
            var localTime = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, tz);

            var focusSession = await _handoffStore.GetActiveFocusAsync(member.Name);
            var status = focusSession != null ? $"[Focus] {focusSession.Message}" : "Available";

            Console.WriteLine($"{member.Name,-15} {localTime:yyyy-MM-dd HH:mm:ss,-25} {member.IanaTimezone,-25} {status,-20}");
        }
    }

    public async Task CreateHandoffAsync(string to, string message)
    {
        var recipient = await _teamDirectory.GetMemberAsync(to);
        if (recipient == null)
        {
            Console.WriteLine($"Error: Team member '{to}' not found.");
            return;
        }

        var note = new HandoffNote(
            Id: Guid.NewGuid().ToString(),
            From: Environment.UserName,
            To: recipient.Name,
            Message: message,
            CreatedAt: DateTime.UtcNow,
            Read: false);

        await _handoffStore.AddNoteAsync(note);
        Console.WriteLine($"Handoff note created for {recipient.Name}: {message}");
        _logger.LogInformation("Handoff note created for {Recipient}: {Message}", to, message);
    }

    public async Task GetInboxAsync()
    {
        var currentUser = Environment.UserName;
        var notes = await _handoffStore.GetPendingNotesAsync(currentUser);

        if (notes.Count == 0)
        {
            Console.WriteLine("No pending handoff notes.");
            return;
        }

        Console.WriteLine($"You have {notes.Count} pending handoff note(s):");
        Console.WriteLine(new string('-', 60));

        foreach (var note in notes)
        {
            Console.WriteLine($"  From: {note.From}");
            Console.WriteLine($"  Date: {note.CreatedAt:yyyy-MM-dd HH:mm} UTC");
            Console.WriteLine($"  Message: {note.Message}");
            Console.WriteLine(new string('-', 60));

            await _handoffStore.MarkReadAsync(note.Id);
        }
    }

    public async Task FindOverlapAsync(string[] members)
    {
        var allMembers = await _teamDirectory.GetMembersAsync();
        var matchedMembers = allMembers
            .Where(m => members.Contains(m.Name, StringComparer.OrdinalIgnoreCase))
            .ToList();

        if (matchedMembers.Count == 0)
        {
            Console.WriteLine("No matching team members found.");
            return;
        }

        // Calculate overlap of 9am-5pm working hours for each member
        // Convert each member's 9-17 local time to UTC, then find intersection
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var utcRanges = matchedMembers.Select(m =>
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById(m.WindowsTimezone);
            var localStart = new DateTime(today.Year, today.Month, today.Day, 9, 0, 0);
            var localEnd = new DateTime(today.Year, today.Month, today.Day, 17, 0, 0);
            var utcStart = TimeZoneInfo.ConvertTimeToUtc(localStart, tz);
            var utcEnd = TimeZoneInfo.ConvertTimeToUtc(localEnd, tz);
            return (m.Name, UtcStart: utcStart, UtcEnd: utcEnd);
        }).ToList();

        var overlapStart = utcRanges.Max(r => r.UtcStart);
        var overlapEnd = utcRanges.Min(r => r.UtcEnd);

        Console.WriteLine($"Overlap for: {string.Join(", ", matchedMembers.Select(m => m.Name))}");

        if (overlapStart >= overlapEnd)
        {
            Console.WriteLine("  No overlapping working hours found.");
        }
        else
        {
            Console.WriteLine($"  UTC overlap: {overlapStart:HH:mm} - {overlapEnd:HH:mm}");

            foreach (var member in matchedMembers)
            {
                var tz = TimeZoneInfo.FindSystemTimeZoneById(member.WindowsTimezone);
                var localStart = TimeZoneInfo.ConvertTimeFromUtc(overlapStart, tz);
                var localEnd = TimeZoneInfo.ConvertTimeFromUtc(overlapEnd, tz);
                Console.WriteLine($"  {member.Name} ({member.IanaTimezone}): {localStart:HH:mm} - {localEnd:HH:mm}");
            }
        }
    }

    public async Task StartFocusAsync(string duration, string message)
    {
        var totalMinutes = ParseDuration(duration);
        if (totalMinutes <= 0)
        {
            Console.WriteLine($"Error: Invalid duration '{duration}'. Use formats like '2h', '30m', or '1h30m'.");
            return;
        }

        var now = DateTime.UtcNow;
        var session = new FocusSession(
            Name: Environment.UserName,
            Message: message,
            StartsAt: now,
            EndsAt: now.AddMinutes(totalMinutes));

        await _handoffStore.SetFocusAsync(session);
        Console.WriteLine($"Focus mode started for {duration}: {message}");
        _logger.LogInformation("Focus mode started for {Duration}: {Message}", duration, message);
    }

    public static int ParseDuration(string duration)
    {
        var totalMinutes = 0;

        // Match patterns like "2h", "30m", "1h30m"
        var hourMatch = Regex.Match(duration, @"(\d+)h", RegexOptions.IgnoreCase);
        var minuteMatch = Regex.Match(duration, @"(\d+)m", RegexOptions.IgnoreCase);

        if (hourMatch.Success)
            totalMinutes += int.Parse(hourMatch.Groups[1].Value) * 60;

        if (minuteMatch.Success)
            totalMinutes += int.Parse(minuteMatch.Groups[1].Value);

        return totalMinutes;
    }
}
