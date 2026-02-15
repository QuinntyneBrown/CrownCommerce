using CrownCommerce.Scheduling.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Scheduling.Api.Controllers;

[ApiController]
[Authorize]
[Route("activity")]
public sealed class ActivityFeedController(ISchedulingService schedulingService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetActivityFeed([FromQuery] Guid employeeId, [FromQuery] int count = 10, [FromQuery] int skip = 0, CancellationToken ct = default)
    {
        var feed = await schedulingService.GetActivityFeedAsync(employeeId, count, skip, ct);
        return Ok(feed);
    }
}
