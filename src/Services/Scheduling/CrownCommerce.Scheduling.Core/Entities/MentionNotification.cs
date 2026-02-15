namespace CrownCommerce.Scheduling.Core.Entities;

public sealed class MentionNotification
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }
    public Guid MentionedEmployeeId { get; set; }
    public Guid SenderEmployeeId { get; set; }
    public Guid ConversationId { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }

    public ConversationMessage Message { get; set; } = null!;
    public Employee MentionedEmployee { get; set; } = null!;
    public Employee SenderEmployee { get; set; } = null!;
}
