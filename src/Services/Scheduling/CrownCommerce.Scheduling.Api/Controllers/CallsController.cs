using CrownCommerce.Scheduling.Application.DTOs;
using CrownCommerce.Scheduling.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Scheduling.Api.Controllers;

[ApiController]
[Route("api/scheduling/calls")]
[Authorize]
public sealed class CallsController(ICallingService callingService) : ControllerBase
{
    [HttpPost("rooms")]
    public async Task<ActionResult<CallRoomDto>> CreateRoom([FromBody] CreateCallRoomRequest request, CancellationToken ct)
    {
        var room = await callingService.CreateRoomAsync(request.Name, ct);
        return Ok(new CallRoomDto(room.Name, room.Url, room.CreatedAt, room.ExpiresAt));
    }

    [HttpGet("rooms/{name}")]
    public async Task<ActionResult<CallRoomDto>> GetRoom(string name, CancellationToken ct)
    {
        var room = await callingService.GetRoomAsync(name, ct);
        if (room is null) return NotFound();
        return Ok(new CallRoomDto(room.Name, room.Url, room.CreatedAt, room.ExpiresAt));
    }

    [HttpDelete("rooms/{name}")]
    public async Task<IActionResult> DeleteRoom(string name, CancellationToken ct)
    {
        await callingService.DeleteRoomAsync(name, ct);
        return NoContent();
    }

    [HttpPost("join")]
    public async Task<ActionResult<CallTokenDto>> JoinCall([FromBody] JoinCallRequest request, CancellationToken ct)
    {
        // Ensure the room exists or create it
        var room = await callingService.GetRoomAsync(request.RoomName, ct);
        room ??= await callingService.CreateRoomAsync(request.RoomName, ct);

        var token = await callingService.CreateMeetingTokenAsync(request.RoomName, request.UserName, request.IsOwner, ct);
        return Ok(new CallTokenDto(token, room.Url));
    }
}
