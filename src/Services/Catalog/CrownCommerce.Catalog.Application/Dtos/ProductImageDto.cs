namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record ProductImageDto(
    Guid Id,
    Guid ProductId,
    string Url,
    string AltText,
    int SortOrder);
