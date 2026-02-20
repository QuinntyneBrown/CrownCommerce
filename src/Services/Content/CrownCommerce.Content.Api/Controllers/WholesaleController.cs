using CrownCommerce.Content.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Content.Api.Controllers;

[ApiController]
[Route("wholesale")]
public sealed class WholesaleController(IContentService contentService) : ControllerBase
{
    [HttpGet("tiers")]
    public async Task<IActionResult> GetTiers(CancellationToken ct)
    {
        var tiers = await contentService.GetWholesaleTiersAsync(ct);
        return Ok(tiers);
    }
}
