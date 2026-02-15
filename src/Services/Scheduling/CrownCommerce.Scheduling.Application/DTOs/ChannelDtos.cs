namespace CrownCommerce.Scheduling.Application.DTOs;

public sealed record ChannelDto(
    Guid Id,
    string Name,
    string? Icon,
    string ChannelType,
    int UnreadCount,
    string? LastMessage,
    DateTime? LastMessageTime,
    int ParticipantCount);

public sealed record ChannelMessageDto(
    Guid Id,
    Guid SenderEmployeeId,
    string SenderName,
    string SenderInitials,
    string Content,
    DateTime SentAt,
    IReadOnlyList<ReactionSummaryDto> Reactions,
    IReadOnlyList<FileAttachmentDto> Attachments);

public sealed record SendChannelMessageDto(
    Guid SenderEmployeeId,
    string Content,
    IReadOnlyList<Guid>? AttachmentIds = null);

public sealed record CreateChannelDto(
    string Name,
    string? Icon,
    string ChannelType,
    Guid CreatedByEmployeeId,
    IReadOnlyList<Guid> ParticipantEmployeeIds);

public sealed record UpdateChannelMessageDto(
    string Content);

public sealed record MarkAsReadDto(
    Guid EmployeeId);

public sealed record ActivityFeedItemDto(
    Guid Id,
    string Type,
    string Icon,
    string Title,
    string Description,
    DateTime OccurredAt);

public sealed record UpdatePresenceDto(
    string Presence);

public sealed record AddReactionDto(
    Guid EmployeeId,
    string Emoji);

public sealed record ReactionDto(
    Guid Id,
    Guid MessageId,
    Guid EmployeeId,
    string Emoji,
    DateTime CreatedAt);

public sealed record ReactionSummaryDto(
    string Emoji,
    int Count,
    bool HasReacted);
