using CrownCommerce.Scheduling.Application.DTOs;
using CrownCommerce.Scheduling.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Scheduling.Api.Controllers;

[ApiController]
[Route("meetings")]
public sealed class MeetingsController(ISchedulingService schedulingService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMeeting(Guid id, CancellationToken ct)
    {
        var meeting = await schedulingService.GetMeetingAsync(id, ct);
        return meeting is not null ? Ok(meeting) : NotFound();
    }

    [HttpGet("calendar")]
    public async Task<IActionResult> GetCalendarEvents(
        [FromQuery] DateTime startUtc,
        [FromQuery] DateTime endUtc,
        [FromQuery] Guid? employeeId,
        CancellationToken ct)
    {
        var events = await schedulingService.GetCalendarEventsAsync(startUtc, endUtc, employeeId, ct);
        return Ok(events);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingMeetings([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var meetings = await schedulingService.GetUpcomingMeetingsAsync(count, ct);
        return Ok(meetings);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMeeting([FromBody] CreateMeetingDto dto, CancellationToken ct)
    {
        var meeting = await schedulingService.CreateMeetingAsync(dto, ct);
        return CreatedAtAction(nameof(GetMeeting), new { id = meeting.Id }, meeting);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateMeeting(Guid id, [FromBody] UpdateMeetingDto dto, CancellationToken ct)
    {
        var meeting = await schedulingService.UpdateMeetingAsync(id, dto, ct);
        return Ok(meeting);
    }

    [HttpPost("{meetingId:guid}/respond/{employeeId:guid}")]
    public async Task<IActionResult> RespondToMeeting(
        Guid meetingId, Guid employeeId, [FromBody] RespondToMeetingDto dto, CancellationToken ct)
    {
        var meeting = await schedulingService.RespondToMeetingAsync(meetingId, employeeId, dto, ct);
        return Ok(meeting);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelMeeting(Guid id, CancellationToken ct)
    {
        await schedulingService.CancelMeetingAsync(id, ct);
        return NoContent();
    }

    [HttpGet("{id:guid}/ical")]
    public async Task<IActionResult> ExportToICal(Guid id, CancellationToken ct)
    {
        var ical = await schedulingService.ExportMeetingToICalAsync(id, ct);
        return File(System.Text.Encoding.UTF8.GetBytes(ical), "text/calendar", "meeting.ics");
    }
}
