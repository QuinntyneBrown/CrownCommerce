using CrownCommerce.Scheduling.Application.DTOs;
using CrownCommerce.Scheduling.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Scheduling.Api.Controllers;

[ApiController]
[Authorize]
[Route("channels")]
public sealed class TeamChannelsController(ISchedulingService schedulingService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetChannels([FromQuery] Guid employeeId, CancellationToken ct)
    {
        var channels = await schedulingService.GetChannelsAsync(employeeId, ct);
        return Ok(channels);
    }

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid id, [FromQuery] int skip = 0, [FromQuery] int take = 50, CancellationToken ct = default)
    {
        var messages = await schedulingService.GetChannelMessagesAsync(id, skip, take, ct);
        return Ok(messages);
    }

    [HttpGet("{id:guid}/messages/search")]
    public async Task<IActionResult> SearchMessages(Guid id, [FromQuery] string query, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(query)) return Ok(Array.Empty<object>());
        var messages = await schedulingService.SearchChannelMessagesAsync(id, query, ct);
        return Ok(messages);
    }

    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> SendMessage(Guid id, [FromBody] SendChannelMessageDto dto, CancellationToken ct)
    {
        var message = await schedulingService.SendChannelMessageAsync(id, dto, ct);
        return Ok(message);
    }

    [HttpPut("{id:guid}/messages/{messageId:guid}")]
    public async Task<IActionResult> UpdateMessage(Guid id, Guid messageId, [FromBody] UpdateChannelMessageDto dto, CancellationToken ct)
    {
        var result = await schedulingService.UpdateChannelMessageAsync(id, messageId, dto, ct);
        return result is not null ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:guid}/messages/{messageId:guid}")]
    public async Task<IActionResult> DeleteMessage(Guid id, Guid messageId, CancellationToken ct)
    {
        await schedulingService.DeleteChannelMessageAsync(id, messageId, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id, [FromBody] MarkAsReadDto dto, CancellationToken ct)
    {
        await schedulingService.MarkChannelAsReadAsync(id, dto, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/messages/{messageId:guid}/reactions")]
    public async Task<IActionResult> AddReaction(Guid id, Guid messageId, [FromBody] AddReactionDto dto, CancellationToken ct)
    {
        var result = await schedulingService.AddReactionAsync(messageId, dto, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/messages/{messageId:guid}/reactions")]
    public async Task<IActionResult> RemoveReaction(Guid id, Guid messageId, [FromQuery] Guid employeeId, [FromQuery] string emoji, CancellationToken ct)
    {
        await schedulingService.RemoveReactionAsync(messageId, employeeId, emoji, ct);
        return NoContent();
    }

    [HttpPost]
    public async Task<IActionResult> CreateChannel([FromBody] CreateChannelDto dto, CancellationToken ct)
    {
        var channel = await schedulingService.CreateChannelAsync(dto, ct);
        return CreatedAtAction(nameof(GetChannels), new { employeeId = dto.CreatedByEmployeeId }, channel);
    }
}
