namespace CrownCommerce.Scheduling.Core.Entities;

public sealed class FileAttachment
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public required string StoragePath { get; set; }
    public required string ContentType { get; set; }
    public long SizeBytes { get; set; }
    public Guid UploadedByEmployeeId { get; set; }
    public Guid? MessageId { get; set; }
    public DateTime UploadedAt { get; set; }

    public Employee UploadedBy { get; set; } = null!;
    public ConversationMessage? Message { get; set; }
}
