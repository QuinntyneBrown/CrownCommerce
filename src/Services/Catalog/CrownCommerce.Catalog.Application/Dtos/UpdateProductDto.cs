namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record UpdateProductDto(
    string Name,
    Guid OriginId,
    string Texture,
    string Type,
    int LengthInches,
    decimal Price,
    string Description,
    string? ImageUrl);
