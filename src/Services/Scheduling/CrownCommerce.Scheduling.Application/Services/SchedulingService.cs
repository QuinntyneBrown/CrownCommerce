using System.Text.RegularExpressions;
using CrownCommerce.Scheduling.Application.DTOs;
using CrownCommerce.Scheduling.Application.Mappings;
using CrownCommerce.Scheduling.Core.Entities;
using CrownCommerce.Scheduling.Core.Enums;
using CrownCommerce.Scheduling.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;

namespace CrownCommerce.Scheduling.Application.Services;

public sealed class SchedulingService(
    IEmployeeRepository employeeRepo,
    IMeetingRepository meetingRepo,
    IConversationRepository conversationRepo,
    IFileAttachmentRepository fileAttachmentRepo,
    IFileStorageService fileStorage,
    ICallingService callingService,
    IPublishEndpoint publishEndpoint) : ISchedulingService
{
    // ─── Employees ──────────────────────────────────────────────────────

    public async Task<IReadOnlyList<EmployeeDto>> GetEmployeesAsync(string? status = null, string? search = null, int skip = 0, int take = 100, CancellationToken ct = default)
    {
        EmployeeStatus? statusFilter = status is not null && Enum.TryParse<EmployeeStatus>(status, true, out var s) ? s : null;
        var employees = await employeeRepo.GetAllAsync(statusFilter, search, skip, take, ct);
        return employees.Select(e => e.ToDto()).ToList();
    }

    public async Task<EmployeeDto?> GetEmployeeAsync(Guid id, CancellationToken ct = default)
    {
        var employee = await employeeRepo.GetByIdAsync(id, ct);
        return employee?.ToDto();
    }

    public async Task<EmployeeDto?> GetEmployeeByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        var employee = await employeeRepo.GetByUserIdAsync(userId, ct);
        return employee?.ToDto();
    }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto, CancellationToken ct = default)
    {
        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            JobTitle = dto.JobTitle,
            Department = dto.Department,
            TimeZone = dto.TimeZone,
            Status = EmployeeStatus.Active,
            CreatedAt = DateTime.UtcNow,
        };

        await employeeRepo.AddAsync(employee, ct);
        return employee.ToDto();
    }

    public async Task<EmployeeDto> UpdateEmployeeAsync(Guid id, UpdateEmployeeDto dto, CancellationToken ct = default)
    {
        var employee = await employeeRepo.GetByIdAsync(id, ct)
            ?? throw new InvalidOperationException($"Employee {id} not found");

        if (dto.Phone is not null) employee.Phone = dto.Phone;
        if (dto.JobTitle is not null) employee.JobTitle = dto.JobTitle;
        if (dto.Department is not null) employee.Department = dto.Department;
        if (dto.TimeZone is not null) employee.TimeZone = dto.TimeZone;
        if (dto.Status is not null && Enum.TryParse<EmployeeStatus>(dto.Status, true, out var s))
            employee.Status = s;

        employee.UpdatedAt = DateTime.UtcNow;
        await employeeRepo.UpdateAsync(employee, ct);
        return employee.ToDto();
    }

    // ─── Meetings ───────────────────────────────────────────────────────

    public async Task<MeetingDto?> GetMeetingAsync(Guid id, CancellationToken ct = default)
    {
        var meeting = await meetingRepo.GetByIdAsync(id, ct);
        if (meeting is null) return null;

        var employeeIds = meeting.Attendees.Select(a => a.EmployeeId).Append(meeting.OrganizerId).Distinct();
        var employees = await employeeRepo.GetByIdsAsync(employeeIds, ct);
        var lookup = employees.ToDictionary(e => e.Id);

        return meeting.ToDto(lookup);
    }

    public async Task<IReadOnlyList<CalendarEventDto>> GetCalendarEventsAsync(
        DateTime startUtc, DateTime endUtc, Guid? employeeId = null, int skip = 0, int take = 50, CancellationToken ct = default)
    {
        var meetings = employeeId.HasValue
            ? await meetingRepo.GetByEmployeeAsync(employeeId.Value, startUtc, endUtc, skip, take, ct)
            : await meetingRepo.GetByDateRangeAsync(startUtc, endUtc, skip, take, ct);

        var organizerIds = meetings.Select(m => m.OrganizerId).Distinct();
        var organizers = await employeeRepo.GetByIdsAsync(organizerIds, ct);
        var lookup = organizers.ToDictionary(e => e.Id);

        return meetings.Select(m =>
        {
            var organizerName = lookup.TryGetValue(m.OrganizerId, out var org)
                ? $"{org.FirstName} {org.LastName}" : "Unknown";
            return m.ToCalendarEvent(organizerName);
        }).ToList();
    }

    public async Task<IReadOnlyList<MeetingDto>> GetUpcomingMeetingsAsync(int count = 10, CancellationToken ct = default)
    {
        var meetings = await meetingRepo.GetUpcomingAsync(count, ct);
        var allEmployeeIds = meetings
            .SelectMany(m => m.Attendees.Select(a => a.EmployeeId).Append(m.OrganizerId))
            .Distinct();
        var employees = await employeeRepo.GetByIdsAsync(allEmployeeIds, ct);
        var lookup = employees.ToDictionary(e => e.Id);

        return meetings.Select(m => m.ToDto(lookup)).ToList();
    }

    public async Task<MeetingDto> CreateMeetingAsync(CreateMeetingDto dto, CancellationToken ct = default)
    {
        var meetingId = Guid.NewGuid();

        string? joinUrl = null;
        if (dto.IsVirtual)
        {
            var roomName = $"meeting-{meetingId:N}".Substring(0, 24);
            var room = await callingService.CreateRoomAsync(roomName, ct);
            joinUrl = room.Url;
        }

        var meeting = new Meeting
        {
            Id = meetingId,
            Title = dto.Title,
            Description = dto.Description,
            StartTimeUtc = dto.StartTimeUtc,
            EndTimeUtc = dto.EndTimeUtc,
            Location = dto.IsVirtual ? null : dto.Location,
            JoinUrl = joinUrl,
            Status = MeetingStatus.Scheduled,
            OrganizerId = dto.OrganizerId,
            CreatedAt = DateTime.UtcNow,
        };

        foreach (var employeeId in dto.AttendeeEmployeeIds.Distinct())
        {
            meeting.Attendees.Add(new MeetingAttendee
            {
                Id = Guid.NewGuid(),
                MeetingId = meeting.Id,
                EmployeeId = employeeId,
                Response = AttendeeResponse.Pending,
            });
        }

        await meetingRepo.AddAsync(meeting, ct);

        // Publish event for email notification
        var attendees = await employeeRepo.GetByIdsAsync(dto.AttendeeEmployeeIds, ct);
        var organizer = await employeeRepo.GetByIdAsync(dto.OrganizerId, ct);

        await publishEndpoint.Publish(new MeetingBookedEvent(
            meeting.Id,
            meeting.Title,
            meeting.StartTimeUtc,
            meeting.EndTimeUtc,
            meeting.Location,
            organizer?.Email ?? "",
            $"{organizer?.FirstName} {organizer?.LastName}",
            attendees.Select(a => a.Email).ToList(),
            DateTime.UtcNow), ct);

        var allIds = dto.AttendeeEmployeeIds.Append(dto.OrganizerId).Distinct();
        var allEmployees = await employeeRepo.GetByIdsAsync(allIds, ct);
        var lookup = allEmployees.ToDictionary(e => e.Id);

        return meeting.ToDto(lookup);
    }

    public async Task<MeetingDto> UpdateMeetingAsync(Guid id, UpdateMeetingDto dto, CancellationToken ct = default)
    {
        var meeting = await meetingRepo.GetByIdAsync(id, ct)
            ?? throw new InvalidOperationException($"Meeting {id} not found");

        if (dto.Title is not null) meeting.Title = dto.Title;
        if (dto.Description is not null) meeting.Description = dto.Description;
        if (dto.StartTimeUtc.HasValue) meeting.StartTimeUtc = dto.StartTimeUtc.Value;
        if (dto.EndTimeUtc.HasValue) meeting.EndTimeUtc = dto.EndTimeUtc.Value;
        if (dto.Location is not null) meeting.Location = dto.Location;
        if (dto.Status is not null && Enum.TryParse<MeetingStatus>(dto.Status, true, out var s))
            meeting.Status = s;

        meeting.UpdatedAt = DateTime.UtcNow;
        await meetingRepo.UpdateAsync(meeting, ct);

        var employeeIds = meeting.Attendees.Select(a => a.EmployeeId).Append(meeting.OrganizerId).Distinct();
        var employees = await employeeRepo.GetByIdsAsync(employeeIds, ct);
        var lookup = employees.ToDictionary(e => e.Id);

        return meeting.ToDto(lookup);
    }

    public async Task<MeetingDto> RespondToMeetingAsync(Guid meetingId, Guid employeeId, RespondToMeetingDto dto, CancellationToken ct = default)
    {
        var meeting = await meetingRepo.GetByIdAsync(meetingId, ct)
            ?? throw new InvalidOperationException($"Meeting {meetingId} not found");

        var attendee = meeting.Attendees.FirstOrDefault(a => a.EmployeeId == employeeId)
            ?? throw new InvalidOperationException($"Employee {employeeId} is not an attendee of meeting {meetingId}");

        if (Enum.TryParse<AttendeeResponse>(dto.Response, true, out var response))
        {
            attendee.Response = response;
            attendee.RespondedAt = DateTime.UtcNow;
        }

        await meetingRepo.UpdateAsync(meeting, ct);

        var employeeIds = meeting.Attendees.Select(a => a.EmployeeId).Append(meeting.OrganizerId).Distinct();
        var employees = await employeeRepo.GetByIdsAsync(employeeIds, ct);
        var lookup = employees.ToDictionary(e => e.Id);

        return meeting.ToDto(lookup);
    }

    public async Task CancelMeetingAsync(Guid id, CancellationToken ct = default)
    {
        var meeting = await meetingRepo.GetByIdAsync(id, ct)
            ?? throw new InvalidOperationException($"Meeting {id} not found");

        meeting.Status = MeetingStatus.Cancelled;
        meeting.UpdatedAt = DateTime.UtcNow;
        await meetingRepo.UpdateAsync(meeting, ct);

        var attendees = await employeeRepo.GetByIdsAsync(meeting.Attendees.Select(a => a.EmployeeId), ct);

        await publishEndpoint.Publish(new MeetingCancelledEvent(
            meeting.Id,
            meeting.Title,
            meeting.StartTimeUtc,
            attendees.Select(a => a.Email).ToList(),
            DateTime.UtcNow), ct);
    }

    public async Task<string> ExportMeetingToICalAsync(Guid id, CancellationToken ct = default)
    {
        var meeting = await meetingRepo.GetByIdAsync(id, ct)
            ?? throw new InvalidOperationException($"Meeting {id} not found");

        var organizer = await employeeRepo.GetByIdAsync(meeting.OrganizerId, ct);
        var attendees = await employeeRepo.GetByIdsAsync(meeting.Attendees.Select(a => a.EmployeeId), ct);

        return GenerateICal(meeting, organizer, attendees);
    }

    public async Task<EmployeeDto> UpdatePresenceAsync(Guid employeeId, UpdatePresenceDto dto, CancellationToken ct = default)
    {
        var employee = await employeeRepo.GetByIdAsync(employeeId, ct)
            ?? throw new InvalidOperationException($"Employee {employeeId} not found");

        if (Enum.TryParse<PresenceStatus>(dto.Presence, true, out var presence))
        {
            employee.Presence = presence;
            employee.LastSeenAt = DateTime.UtcNow;
            employee.UpdatedAt = DateTime.UtcNow;
            await employeeRepo.UpdateAsync(employee, ct);
        }

        return employee.ToDto();
    }

    // ─── Conversations ──────────────────────────────────────────────────

    public async Task<IReadOnlyList<ConversationSummaryDto>> GetConversationsAsync(Guid? employeeId = null, CancellationToken ct = default)
    {
        var conversations = employeeId.HasValue
            ? await conversationRepo.GetByEmployeeAsync(employeeId.Value, ct)
            : await conversationRepo.GetRecentAsync(50, ct);

        return conversations.Select(c => c.ToSummaryDto()).ToList();
    }

    public async Task<ConversationDto?> GetConversationAsync(Guid id, CancellationToken ct = default)
    {
        var conversation = await conversationRepo.GetByIdAsync(id, ct);
        return conversation?.ToDto();
    }

    public async Task<ConversationDto> CreateConversationAsync(CreateConversationDto dto, CancellationToken ct = default)
    {
        var conversation = new ScheduleConversation
        {
            Id = Guid.NewGuid(),
            Subject = dto.Subject,
            MeetingId = dto.MeetingId,
            Status = ConversationStatus.Active,
            CreatedByEmployeeId = dto.CreatedByEmployeeId,
            CreatedAt = DateTime.UtcNow,
        };

        var allParticipants = dto.ParticipantEmployeeIds.Append(dto.CreatedByEmployeeId).Distinct();
        foreach (var participantId in allParticipants)
        {
            conversation.Participants.Add(new ConversationParticipant
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                EmployeeId = participantId,
                JoinedAt = DateTime.UtcNow,
            });
        }

        if (dto.InitialMessage is not null)
        {
            conversation.Messages.Add(new ConversationMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                SenderEmployeeId = dto.CreatedByEmployeeId,
                Content = dto.InitialMessage,
                SentAt = DateTime.UtcNow,
            });
            conversation.LastMessageAt = DateTime.UtcNow;
        }

        await conversationRepo.AddAsync(conversation, ct);
        return conversation.ToDto();
    }

    public async Task<ConversationMessageDto> SendMessageAsync(Guid conversationId, SendMessageDto dto, CancellationToken ct = default)
    {
        var message = new ConversationMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderEmployeeId = dto.SenderEmployeeId,
            Content = dto.Content,
            SentAt = DateTime.UtcNow,
        };

        await conversationRepo.AddMessageAsync(message, ct);
        return message.ToDto();
    }

    // ─── Channels ─────────────────────────────────────────────────────

    public async Task<IReadOnlyList<ChannelDto>> GetChannelsAsync(Guid employeeId, CancellationToken ct = default)
    {
        var channels = await conversationRepo.GetChannelsByTypeAsync(null, ct);

        // Filter to channels the employee is a participant of
        channels = channels
            .Where(c => c.Participants.Any(p => p.EmployeeId == employeeId))
            .ToList();

        var result = new List<ChannelDto>();
        foreach (var channel in channels)
        {
            var unread = await conversationRepo.GetUnreadCountAsync(channel.Id, employeeId, ct);
            result.Add(channel.ToChannelDto(unread));
        }

        return result;
    }

    public async Task<IReadOnlyList<ChannelMessageDto>> GetChannelMessagesAsync(Guid channelId, int skip = 0, int take = 50, CancellationToken ct = default)
    {
        var conversation = await conversationRepo.GetByIdAsync(channelId, ct);
        if (conversation is null) return [];

        var paged = conversation.Messages
            .OrderByDescending(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .OrderBy(m => m.SentAt)
            .ToList();

        var senderIds = paged.Select(m => m.SenderEmployeeId).Distinct();
        var employees = await employeeRepo.GetByIdsAsync(senderIds, ct);
        var lookup = employees.ToDictionary(e => e.Id);

        return paged
            .Select(m => m.ToChannelMessageDto(lookup.GetValueOrDefault(m.SenderEmployeeId), fileStorage: fileStorage))
            .ToList();
    }

    public async Task<IReadOnlyList<ChannelMessageDto>> SearchChannelMessagesAsync(Guid channelId, string query, CancellationToken ct = default)
    {
        var conversation = await conversationRepo.GetByIdAsync(channelId, ct);
        if (conversation is null) return [];

        var filtered = conversation.Messages
            .Where(m => m.Content.Contains(query, StringComparison.OrdinalIgnoreCase))
            .OrderBy(m => m.SentAt)
            .ToList();

        var senderIds = filtered.Select(m => m.SenderEmployeeId).Distinct();
        var employees = await employeeRepo.GetByIdsAsync(senderIds, ct);
        var lookup = employees.ToDictionary(e => e.Id);

        return filtered
            .Select(m => m.ToChannelMessageDto(lookup.GetValueOrDefault(m.SenderEmployeeId)))
            .ToList();
    }

    public async Task<ChannelMessageDto> SendChannelMessageAsync(Guid channelId, SendChannelMessageDto dto, CancellationToken ct = default)
    {
        var message = new ConversationMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = channelId,
            SenderEmployeeId = dto.SenderEmployeeId,
            Content = dto.Content,
            SentAt = DateTime.UtcNow,
        };

        await conversationRepo.AddMessageAsync(message, ct);

        // Parse @mentions and create notification entries
        var mentionNames = ParseMentions(dto.Content);
        if (mentionNames.Count > 0)
        {
            var mentionedEmployees = await employeeRepo.GetByFullNamesAsync(mentionNames, ct);
            var notifications = mentionedEmployees
                .Where(e => e.Id != dto.SenderEmployeeId) // Don't notify self
                .Select(e => new MentionNotification
                {
                    Id = Guid.NewGuid(),
                    MessageId = message.Id,
                    MentionedEmployeeId = e.Id,
                    SenderEmployeeId = dto.SenderEmployeeId,
                    ConversationId = channelId,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow,
                })
                .ToList();

            if (notifications.Count > 0)
            {
                await conversationRepo.AddMentionNotificationsAsync(notifications, ct);
            }
        }

        // Link any uploaded file attachments to this message
        if (dto.AttachmentIds is { Count: > 0 })
        {
            foreach (var attachmentId in dto.AttachmentIds)
            {
                var attachment = await fileAttachmentRepo.GetByIdAsync(attachmentId, ct);
                if (attachment is not null)
                {
                    attachment.MessageId = message.Id;
                    await fileAttachmentRepo.UpdateAsync(attachment, ct);
                    message.Attachments.Add(attachment);
                }
            }
        }

        var sender = await employeeRepo.GetByIdAsync(dto.SenderEmployeeId, ct);
        return message.ToChannelMessageDto(sender, fileStorage: fileStorage);
    }

    public async Task<ChannelMessageDto?> UpdateChannelMessageAsync(Guid channelId, Guid messageId, UpdateChannelMessageDto dto, CancellationToken ct = default)
    {
        var message = await conversationRepo.GetMessageAsync(messageId, ct);
        if (message is null || message.ConversationId != channelId) return null;

        message.Content = dto.Content;
        await conversationRepo.UpdateMessageAsync(message, ct);

        var sender = await employeeRepo.GetByIdAsync(message.SenderEmployeeId, ct);
        return message.ToChannelMessageDto(sender);
    }

    public async Task DeleteChannelMessageAsync(Guid channelId, Guid messageId, CancellationToken ct = default)
    {
        var message = await conversationRepo.GetMessageAsync(messageId, ct);
        if (message is not null && message.ConversationId == channelId)
        {
            await conversationRepo.DeleteMessageAsync(messageId, ct);
        }
    }

    public async Task MarkChannelAsReadAsync(Guid channelId, MarkAsReadDto dto, CancellationToken ct = default)
    {
        var receipt = new ChannelReadReceipt
        {
            Id = Guid.NewGuid(),
            ConversationId = channelId,
            EmployeeId = dto.EmployeeId,
            LastReadAt = DateTime.UtcNow,
        };

        await conversationRepo.UpsertReadReceiptAsync(receipt, ct);
    }

    public async Task<ChannelDto> CreateChannelAsync(CreateChannelDto dto, CancellationToken ct = default)
    {
        if (!Enum.TryParse<ChannelType>(dto.ChannelType, true, out var channelType))
            channelType = ChannelType.Public;

        var conversation = new ScheduleConversation
        {
            Id = Guid.NewGuid(),
            Subject = dto.Name,
            Icon = dto.Icon,
            ChannelType = channelType,
            Status = ConversationStatus.Active,
            CreatedByEmployeeId = dto.CreatedByEmployeeId,
            CreatedAt = DateTime.UtcNow,
        };

        var allParticipants = dto.ParticipantEmployeeIds.Append(dto.CreatedByEmployeeId).Distinct();
        foreach (var participantId in allParticipants)
        {
            conversation.Participants.Add(new ConversationParticipant
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                EmployeeId = participantId,
                JoinedAt = DateTime.UtcNow,
            });
        }

        await conversationRepo.AddAsync(conversation, ct);
        return conversation.ToChannelDto();
    }

    // ─── Reactions ───────────────────────────────────────────────────

    public async Task<ReactionDto> AddReactionAsync(Guid messageId, AddReactionDto dto, CancellationToken ct = default)
    {
        var existing = await conversationRepo.GetReactionAsync(messageId, dto.EmployeeId, dto.Emoji, ct);
        if (existing is not null)
        {
            return new ReactionDto(existing.Id, existing.MessageId, existing.EmployeeId, existing.Emoji, existing.CreatedAt);
        }

        var reaction = new MessageReaction
        {
            Id = Guid.NewGuid(),
            MessageId = messageId,
            EmployeeId = dto.EmployeeId,
            Emoji = dto.Emoji,
            CreatedAt = DateTime.UtcNow,
        };

        await conversationRepo.AddReactionAsync(reaction, ct);
        return new ReactionDto(reaction.Id, reaction.MessageId, reaction.EmployeeId, reaction.Emoji, reaction.CreatedAt);
    }

    public async Task RemoveReactionAsync(Guid messageId, Guid employeeId, string emoji, CancellationToken ct = default)
    {
        var reaction = await conversationRepo.GetReactionAsync(messageId, employeeId, emoji, ct);
        if (reaction is not null)
        {
            await conversationRepo.RemoveReactionAsync(reaction.Id, ct);
        }
    }

    // ─── Activity Feed ───────────────────────────────────────────────

    public async Task<IReadOnlyList<ActivityFeedItemDto>> GetActivityFeedAsync(Guid employeeId, int count = 10, int skip = 0, CancellationToken ct = default)
    {
        var items = new List<ActivityFeedItemDto>();

        // Fetch extra to account for skip
        var fetchCount = skip + count;

        // Recent messages across all channels
        var recentMessages = await conversationRepo.GetRecentMessagesAsync(fetchCount, ct);
        foreach (var msg in recentMessages)
        {
            var sender = await employeeRepo.GetByIdAsync(msg.SenderEmployeeId, ct);
            var senderName = sender is not null ? $"{sender.FirstName} {sender.LastName}" : "Unknown";
            items.Add(new ActivityFeedItemDto(
                msg.Id,
                "message",
                "chat",
                $"New message from {senderName}",
                msg.Content.Length > 80 ? msg.Content[..80] + "..." : msg.Content,
                msg.SentAt));
        }

        // Upcoming meetings
        var meetings = await meetingRepo.GetUpcomingAsync(fetchCount, ct);
        foreach (var meeting in meetings)
        {
            items.Add(new ActivityFeedItemDto(
                meeting.Id,
                "meeting",
                "videocam",
                meeting.Title,
                $"{meeting.StartTimeUtc:g} - {meeting.Attendees.Count} attendees",
                meeting.StartTimeUtc));
        }

        return items
            .OrderByDescending(i => i.OccurredAt)
            .Skip(skip)
            .Take(count)
            .ToList();
    }

    // ─── Files ─────────────────────────────────────────────────────────

    public async Task<FileAttachmentDto> UploadFileAsync(Stream stream, string fileName, string contentType, long sizeBytes, Guid employeeId, CancellationToken ct = default)
    {
        var storagePath = await fileStorage.SaveAsync(stream, fileName, contentType, ct);

        var attachment = new FileAttachment
        {
            Id = Guid.NewGuid(),
            FileName = fileName,
            StoragePath = storagePath,
            ContentType = contentType,
            SizeBytes = sizeBytes,
            UploadedByEmployeeId = employeeId,
            UploadedAt = DateTime.UtcNow,
        };

        await fileAttachmentRepo.AddAsync(attachment, ct);

        return new FileAttachmentDto(
            attachment.Id,
            attachment.FileName,
            attachment.ContentType,
            attachment.SizeBytes,
            fileStorage.GetPublicUrl(attachment.StoragePath),
            attachment.UploadedByEmployeeId,
            attachment.MessageId,
            attachment.UploadedAt);
    }

    public async Task<FileAttachmentDto?> GetFileAsync(Guid id, CancellationToken ct = default)
    {
        var attachment = await fileAttachmentRepo.GetByIdAsync(id, ct);
        if (attachment is null) return null;

        return new FileAttachmentDto(
            attachment.Id,
            attachment.FileName,
            attachment.ContentType,
            attachment.SizeBytes,
            fileStorage.GetPublicUrl(attachment.StoragePath),
            attachment.UploadedByEmployeeId,
            attachment.MessageId,
            attachment.UploadedAt);
    }

    public async Task DeleteFileAsync(Guid id, CancellationToken ct = default)
    {
        var attachment = await fileAttachmentRepo.GetByIdAsync(id, ct)
            ?? throw new InvalidOperationException($"File {id} not found");

        await fileStorage.DeleteAsync(attachment.StoragePath, ct);
        await fileAttachmentRepo.DeleteAsync(attachment, ct);
    }

    // ─── Helpers ────────────────────────────────────────────────────────

    private static string GenerateICal(Meeting meeting, Employee? organizer, IReadOnlyList<Employee> attendees)
    {
        var lines = new List<string>
        {
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//CrownCommerce//Scheduling//EN",
            "BEGIN:VEVENT",
            $"UID:{meeting.Id}@crowncommerce.com",
            $"DTSTART:{meeting.StartTimeUtc:yyyyMMdd'T'HHmmss'Z'}",
            $"DTEND:{meeting.EndTimeUtc:yyyyMMdd'T'HHmmss'Z'}",
            $"SUMMARY:{EscapeICalText(meeting.Title)}",
        };

        if (meeting.Description is not null)
            lines.Add($"DESCRIPTION:{EscapeICalText(meeting.Description)}");

        if (meeting.Location is not null)
            lines.Add($"LOCATION:{EscapeICalText(meeting.Location)}");

        if (organizer is not null)
            lines.Add($"ORGANIZER;CN={organizer.FirstName} {organizer.LastName}:mailto:{organizer.Email}");

        foreach (var attendee in attendees)
            lines.Add($"ATTENDEE;CN={attendee.FirstName} {attendee.LastName}:mailto:{attendee.Email}");

        lines.Add($"DTSTAMP:{DateTime.UtcNow:yyyyMMdd'T'HHmmss'Z'}");
        lines.Add("END:VEVENT");
        lines.Add("END:VCALENDAR");

        return string.Join("\r\n", lines);
    }

    private static string EscapeICalText(string text) =>
        text.Replace("\\", "\\\\").Replace(";", "\\;").Replace(",", "\\,").Replace("\n", "\\n");

    private static IReadOnlyList<string> ParseMentions(string content)
    {
        var matches = Regex.Matches(content, @"@([A-Z][a-z]+ [A-Z][a-z]+)");
        return matches.Select(m => m.Groups[1].Value).Distinct().ToList();
    }
}
