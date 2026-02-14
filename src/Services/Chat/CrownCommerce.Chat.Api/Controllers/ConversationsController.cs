using CrownCommerce.Chat.Application.Dtos;
using CrownCommerce.Chat.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Chat.Api.Controllers;

[ApiController]
[Route("conversations")]
public sealed class ConversationsController(IChatService chatService) : ControllerBase
{
    // Visitor: Start a new conversation
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateConversationDto dto, CancellationToken ct)
    {
        var conversation = await chatService.CreateConversationAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = conversation.Id }, conversation);
    }

    // Visitor: Get conversation by ID (session validated) or Admin: Get any conversation
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, [FromQuery] string? sessionId, CancellationToken ct)
    {
        if (!string.IsNullOrEmpty(sessionId))
        {
            var conversation = await chatService.GetConversationBySessionAsync(id, sessionId, ct);
            return conversation is null ? NotFound() : Ok(conversation);
        }

        // Admin access (requires auth)
        var conv = await chatService.GetConversationAsync(id, ct);
        return conv is null ? NotFound() : Ok(conv);
    }

    // Visitor: Send a message (REST fallback)
    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> SendMessage(Guid id, [FromQuery] string sessionId, [FromBody] SendMessageDto dto, CancellationToken ct)
    {
        var message = await chatService.AddVisitorMessageAsync(id, sessionId, dto.Content, ct);
        return Ok(message);
    }

    // Admin: List all conversations
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 20, CancellationToken ct = default)
    {
        var conversations = await chatService.GetAllConversationsAsync(skip, take, ct);
        return Ok(conversations);
    }

    // Admin: Get aggregate stats
    [Authorize]
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
    {
        var stats = await chatService.GetStatsAsync(ct);
        return Ok(stats);
    }
}
