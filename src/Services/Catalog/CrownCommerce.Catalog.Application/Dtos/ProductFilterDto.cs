namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record ProductFilterDto(
    string? Texture = null,
    int? LengthInches = null,
    string? Size = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? Search = null,
    string? SortBy = null,
    string? SortDirection = null,
    int Page = 1,
    int PageSize = 20);
