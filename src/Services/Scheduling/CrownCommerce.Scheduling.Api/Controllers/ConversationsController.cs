using CrownCommerce.Scheduling.Application.DTOs;
using CrownCommerce.Scheduling.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Scheduling.Api.Controllers;

[ApiController]
[Authorize]
[Route("conversations")]
public sealed class ConversationsController(ISchedulingService schedulingService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetConversations([FromQuery] Guid? employeeId, CancellationToken ct)
    {
        var conversations = await schedulingService.GetConversationsAsync(employeeId, ct);
        return Ok(conversations);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetConversation(Guid id, CancellationToken ct)
    {
        var conversation = await schedulingService.GetConversationAsync(id, ct);
        return conversation is not null ? Ok(conversation) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDto dto, CancellationToken ct)
    {
        var conversation = await schedulingService.CreateConversationAsync(dto, ct);
        return CreatedAtAction(nameof(GetConversation), new { id = conversation.Id }, conversation);
    }

    [HttpPost("{conversationId:guid}/messages")]
    public async Task<IActionResult> SendMessage(
        Guid conversationId, [FromBody] SendMessageDto dto, CancellationToken ct)
    {
        var message = await schedulingService.SendMessageAsync(conversationId, dto, ct);
        return Created($"/conversations/{conversationId}/messages/{message.Id}", message);
    }
}
