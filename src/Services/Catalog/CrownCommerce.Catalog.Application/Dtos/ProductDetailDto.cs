namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record ProductDetailDto(
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
    IReadOnlyList<ProductImageDto> Images,
    decimal Rating,
    int ReviewCount,
    int[] AvailableLengths,
    string[] Features,
    bool InStock,
    IReadOnlyList<BreadcrumbItemDto> Breadcrumb);
