namespace CrownCommerce.Scheduling.Core.Entities;

public sealed class ConversationMessage
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderEmployeeId { get; set; }
    public required string Content { get; set; }
    public DateTime SentAt { get; set; }
    public ScheduleConversation Conversation { get; set; } = null!;
    public ICollection<MessageReaction> Reactions { get; set; } = [];
    public ICollection<FileAttachment> Attachments { get; set; } = [];
}
