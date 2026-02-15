namespace CrownCommerce.Scheduling.Application.DTOs;

public sealed record FileAttachmentDto(
    Guid Id,
    string FileName,
    string ContentType,
    long SizeBytes,
    string Url,
    Guid UploadedByEmployeeId,
    Guid? MessageId,
    DateTime UploadedAt);
