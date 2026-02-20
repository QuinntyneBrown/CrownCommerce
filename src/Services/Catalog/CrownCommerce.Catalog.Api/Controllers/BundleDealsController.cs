using CrownCommerce.Catalog.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Catalog.Api.Controllers;

[ApiController]
[Route("bundle-deals")]
public sealed class BundleDealsController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var deals = await catalogService.GetBundleDealsAsync(ct);
        return Ok(deals);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var deal = await catalogService.GetBundleDealByIdAsync(id, ct);
        return deal is null ? NotFound() : Ok(deal);
    }
}
