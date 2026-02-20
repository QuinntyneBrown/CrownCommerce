using CrownCommerce.Content.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Content.Api.Controllers;

[ApiController]
[Route("ambassador")]
public sealed class AmbassadorController(IContentService contentService) : ControllerBase
{
    [HttpGet("benefits")]
    public async Task<IActionResult> GetBenefits(CancellationToken ct)
    {
        var benefits = await contentService.GetAmbassadorBenefitsAsync(ct);
        return Ok(benefits);
    }
}
