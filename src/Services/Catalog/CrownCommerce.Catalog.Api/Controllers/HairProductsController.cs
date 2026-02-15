using CrownCommerce.Catalog.Application.Dtos;
using CrownCommerce.Catalog.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Catalog.Api.Controllers;

[ApiController]
[Route("products")]
public sealed class HairProductsController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var products = await catalogService.GetAllProductsAsync(ct);
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var product = await catalogService.GetProductByIdAsync(id, ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet("by-origin/{originId:guid}")]
    public async Task<IActionResult> GetByOrigin(Guid originId, CancellationToken ct)
    {
        var products = await catalogService.GetProductsByOriginAsync(originId, ct);
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto, CancellationToken ct)
    {
        var product = await catalogService.CreateProductAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto, CancellationToken ct)
    {
        var product = await catalogService.UpdateProductAsync(id, dto, ct);
        return Ok(product);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await catalogService.DeleteProductAsync(id, ct);
        return NoContent();
    }
}
