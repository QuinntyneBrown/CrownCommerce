namespace CrownCommerce.Scheduling.Core.Entities;

public sealed class MessageReaction
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }
    public Guid EmployeeId { get; set; }
    public required string Emoji { get; set; }
    public DateTime CreatedAt { get; set; }
    public ConversationMessage Message { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
