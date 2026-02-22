namespace CrownCommerce.Cli.Sync.Commands;

public record HandoffNote(string Id, string From, string To, string Message, DateTime CreatedAt, bool Read);
