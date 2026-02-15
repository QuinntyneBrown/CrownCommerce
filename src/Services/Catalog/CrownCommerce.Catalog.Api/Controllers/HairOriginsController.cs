using CrownCommerce.Catalog.Application.Dtos;
using CrownCommerce.Catalog.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Catalog.Api.Controllers;

[ApiController]
[Route("origins")]
public sealed class HairOriginsController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var origins = await catalogService.GetAllOriginsAsync(ct);
        return Ok(origins);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var origin = await catalogService.GetOriginByIdAsync(id, ct);
        return origin is null ? NotFound() : Ok(origin);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOriginDto dto, CancellationToken ct)
    {
        var origin = await catalogService.CreateOriginAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = origin.Id }, origin);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOriginDto dto, CancellationToken ct)
    {
        var origin = await catalogService.UpdateOriginAsync(id, dto, ct);
        return Ok(origin);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await catalogService.DeleteOriginAsync(id, ct);
        return NoContent();
    }
}
