using OriginHairCollective.Chat.Core.Enums;

namespace OriginHairCollective.Chat.Core.Entities;

public sealed class ChatMessage
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public MessageSender SenderType { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public int? TokensUsed { get; set; }
    public Conversation Conversation { get; set; } = null!;
}
