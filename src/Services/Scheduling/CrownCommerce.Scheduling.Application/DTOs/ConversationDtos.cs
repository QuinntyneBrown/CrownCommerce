namespace CrownCommerce.Scheduling.Application.DTOs;

public sealed record ConversationDto(
    Guid Id,
    string Subject,
    Guid? MeetingId,
    string Status,
    Guid CreatedByEmployeeId,
    DateTime CreatedAt,
    DateTime? LastMessageAt,
    IReadOnlyList<ConversationMessageDto> Messages,
    IReadOnlyList<ConversationParticipantDto> Participants);

public sealed record ConversationSummaryDto(
    Guid Id,
    string Subject,
    Guid? MeetingId,
    string Status,
    Guid CreatedByEmployeeId,
    DateTime CreatedAt,
    DateTime? LastMessageAt,
    int MessageCount,
    int ParticipantCount);

public sealed record ConversationMessageDto(
    Guid Id,
    Guid SenderEmployeeId,
    string Content,
    DateTime SentAt);

public sealed record ConversationParticipantDto(
    Guid EmployeeId,
    DateTime JoinedAt);

public sealed record CreateConversationDto(
    string Subject,
    Guid? MeetingId,
    Guid CreatedByEmployeeId,
    IReadOnlyList<Guid> ParticipantEmployeeIds,
    string? InitialMessage);

public sealed record SendMessageDto(
    Guid SenderEmployeeId,
    string Content);
