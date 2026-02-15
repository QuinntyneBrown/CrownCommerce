using CrownCommerce.Scheduling.Core.Enums;

namespace CrownCommerce.Scheduling.Core.Entities;

public sealed class Meeting
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime StartTimeUtc { get; set; }
    public DateTime EndTimeUtc { get; set; }
    public string? Location { get; set; }
    public MeetingStatus Status { get; set; }
    public Guid OrganizerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? JoinUrl { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public ICollection<MeetingAttendee> Attendees { get; set; } = [];
}
