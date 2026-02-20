using CrownCommerce.Content.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Content.Api.Controllers;

[ApiController]
[Route("shipping")]
public sealed class ShippingController(IContentService contentService) : ControllerBase
{
    [HttpGet("zones")]
    public async Task<IActionResult> GetZones(CancellationToken ct)
    {
        var zones = await contentService.GetShippingZonesAsync(ct);
        return Ok(zones);
    }
}
