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

    [HttpGet("{id:guid}/detail")]
    public async Task<IActionResult> GetDetail(Guid id, CancellationToken ct)
    {
        var detail = await catalogService.GetProductDetailAsync(id, ct);
        return detail is null ? NotFound() : Ok(detail);
    }

    [HttpGet("by-origin/{originId:guid}")]
    public async Task<IActionResult> GetByOrigin(Guid originId, CancellationToken ct)
    {
        var products = await catalogService.GetProductsByOriginAsync(originId, ct);
        return Ok(products);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(
        string category,
        [FromQuery] string? texture,
        [FromQuery] int? lengthInches,
        [FromQuery] string? size,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortDirection,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var filter = new ProductFilterDto(texture, lengthInches, size, minPrice, maxPrice, search, sortBy, sortDirection, page, pageSize);
        var result = await catalogService.GetProductsByCategoryAsync(category, filter, ct);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? texture,
        [FromQuery] int? lengthInches,
        [FromQuery] string? size,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortDirection,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var filter = new ProductFilterDto(texture, lengthInches, size, minPrice, maxPrice, search, sortBy, sortDirection, page, pageSize);
        var result = await catalogService.SearchProductsAsync(filter, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/reviews")]
    public async Task<IActionResult> GetReviews(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        var result = await catalogService.GetProductReviewsAsync(id, page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/reviews")]
    public async Task<IActionResult> CreateReview(Guid id, [FromBody] CreateProductReviewDto dto, CancellationToken ct)
    {
        var review = await catalogService.CreateProductReviewAsync(id, dto, ct);
        return Created($"/products/{id}/reviews/{review.Id}", review);
    }

    [HttpGet("{id:guid}/related")]
    public async Task<IActionResult> GetRelated(Guid id, CancellationToken ct)
    {
        var products = await catalogService.GetRelatedProductsAsync(id, ct);
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
