using CrownCommerce.Cli.Sync.Commands;

namespace CrownCommerce.Cli.Sync.Services;

public interface IHandoffStore
{
    Task<IReadOnlyList<HandoffNote>> GetPendingNotesAsync(string recipient);
    Task AddNoteAsync(HandoffNote note);
    Task MarkReadAsync(string noteId);
    Task<FocusSession?> GetActiveFocusAsync(string name);
    Task SetFocusAsync(FocusSession session);
}
