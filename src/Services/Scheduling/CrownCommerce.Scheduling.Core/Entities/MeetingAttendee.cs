using CrownCommerce.Scheduling.Core.Enums;

namespace CrownCommerce.Scheduling.Core.Entities;

public sealed class MeetingAttendee
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public Guid EmployeeId { get; set; }
    public AttendeeResponse Response { get; set; }
    public DateTime? RespondedAt { get; set; }
    public Meeting Meeting { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
