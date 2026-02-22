using System.Text.Json;
using CrownCommerce.Cli.Sync.Commands;

namespace CrownCommerce.Cli.Sync.Services;

public class HandoffStore : IHandoffStore
{
    private static readonly string BaseDir = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
        ".crowncommerce", "sync");

    private static readonly string HandoffsFile = Path.Combine(BaseDir, "handoffs.json");
    private static readonly string FocusFile = Path.Combine(BaseDir, "focus.json");

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public async Task<IReadOnlyList<HandoffNote>> GetPendingNotesAsync(string recipient)
    {
        var notes = await LoadHandoffNotesAsync();
        return notes
            .Where(n => n.To.Equals(recipient, StringComparison.OrdinalIgnoreCase) && !n.Read)
            .ToList()
            .AsReadOnly();
    }

    public async Task AddNoteAsync(HandoffNote note)
    {
        var notes = await LoadHandoffNotesAsync();
        notes.Add(note);
        await SaveHandoffNotesAsync(notes);
    }

    public async Task MarkReadAsync(string noteId)
    {
        var notes = await LoadHandoffNotesAsync();
        for (var i = 0; i < notes.Count; i++)
        {
            if (notes[i].Id == noteId)
            {
                notes[i] = notes[i] with { Read = true };
                break;
            }
        }
        await SaveHandoffNotesAsync(notes);
    }

    public async Task<FocusSession?> GetActiveFocusAsync(string name)
    {
        var sessions = await LoadFocusSessionsAsync();
        var now = DateTime.UtcNow;
        return sessions.FirstOrDefault(s =>
            s.Name.Equals(name, StringComparison.OrdinalIgnoreCase) &&
            s.StartsAt <= now && s.EndsAt > now);
    }

    public async Task SetFocusAsync(FocusSession session)
    {
        var sessions = await LoadFocusSessionsAsync();

        // Remove any existing session for this user
        sessions.RemoveAll(s => s.Name.Equals(session.Name, StringComparison.OrdinalIgnoreCase));
        sessions.Add(session);

        await SaveFocusSessionsAsync(sessions);
    }

    private static async Task<List<HandoffNote>> LoadHandoffNotesAsync()
    {
        if (!File.Exists(HandoffsFile))
            return new List<HandoffNote>();

        var json = await File.ReadAllTextAsync(HandoffsFile);
        return JsonSerializer.Deserialize<List<HandoffNote>>(json, JsonOptions) ?? new List<HandoffNote>();
    }

    private static async Task SaveHandoffNotesAsync(List<HandoffNote> notes)
    {
        Directory.CreateDirectory(BaseDir);
        var json = JsonSerializer.Serialize(notes, JsonOptions);
        await File.WriteAllTextAsync(HandoffsFile, json);
    }

    private static async Task<List<FocusSession>> LoadFocusSessionsAsync()
    {
        if (!File.Exists(FocusFile))
            return new List<FocusSession>();

        var json = await File.ReadAllTextAsync(FocusFile);
        return JsonSerializer.Deserialize<List<FocusSession>>(json, JsonOptions) ?? new List<FocusSession>();
    }

    private static async Task SaveFocusSessionsAsync(List<FocusSession> sessions)
    {
        Directory.CreateDirectory(BaseDir);
        var json = JsonSerializer.Serialize(sessions, JsonOptions);
        await File.WriteAllTextAsync(FocusFile, json);
    }
}
