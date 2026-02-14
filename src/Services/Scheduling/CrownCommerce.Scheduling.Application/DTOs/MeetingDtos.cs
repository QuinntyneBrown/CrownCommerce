namespace CrownCommerce.Scheduling.Application.DTOs;

public sealed record MeetingDto(
    Guid Id,
    string Title,
    string? Description,
    DateTime StartTimeUtc,
    DateTime EndTimeUtc,
    string? Location,
    string Status,
    Guid OrganizerId,
    DateTime CreatedAt,
    IReadOnlyList<MeetingAttendeeDto> Attendees);

public sealed record MeetingAttendeeDto(
    Guid Id,
    Guid EmployeeId,
    string EmployeeName,
    string EmployeeEmail,
    string Response,
    DateTime? RespondedAt);

public sealed record CreateMeetingDto(
    string Title,
    string? Description,
    DateTime StartTimeUtc,
    DateTime EndTimeUtc,
    string? Location,
    Guid OrganizerId,
    IReadOnlyList<Guid> AttendeeEmployeeIds);

public sealed record UpdateMeetingDto(
    string? Title,
    string? Description,
    DateTime? StartTimeUtc,
    DateTime? EndTimeUtc,
    string? Location,
    string? Status);

public sealed record RespondToMeetingDto(
    string Response);

public sealed record CalendarEventDto(
    Guid Id,
    string Title,
    DateTime StartTimeUtc,
    DateTime EndTimeUtc,
    string? Location,
    string Status,
    int AttendeeCount,
    string OrganizerName);
