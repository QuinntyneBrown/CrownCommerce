namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record HairProductDto(
    Guid Id,
    string Name,
    Guid OriginId,
    string OriginCountry,
    string Texture,
    string Type,
    string Category,
    int LengthInches,
    decimal Price,
    string Description,
    string? ImageUrl,
    string[] ImageUrls,
    decimal Rating,
    int ReviewCount,
    int[] AvailableLengths,
    string[] Features,
    bool InStock);
