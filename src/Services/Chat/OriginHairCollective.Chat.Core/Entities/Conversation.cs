using OriginHairCollective.Chat.Core.Enums;

namespace OriginHairCollective.Chat.Core.Entities;

public sealed class Conversation
{
    public Guid Id { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string? VisitorName { get; set; }
    public string? VisitorEmail { get; set; }
    public ConversationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public int MessageCount { get; set; }
    public ICollection<ChatMessage> Messages { get; set; } = [];
}
