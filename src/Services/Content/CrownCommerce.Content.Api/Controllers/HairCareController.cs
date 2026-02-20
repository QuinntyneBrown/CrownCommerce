using CrownCommerce.Content.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Content.Api.Controllers;

[ApiController]
[Route("hair-care")]
public sealed class HairCareController(IContentService contentService) : ControllerBase
{
    [HttpGet("sections")]
    public async Task<IActionResult> GetSections(CancellationToken ct)
    {
        var sections = await contentService.GetHairCareSectionsAsync(ct);
        return Ok(sections);
    }
}
