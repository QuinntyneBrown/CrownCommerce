namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record BundleDealDto(
    Guid Id,
    string Name,
    string Description,
    IReadOnlyList<BundleDealItemDto> Items,
    decimal OriginalPrice,
    decimal DealPrice,
    decimal SavingsAmount,
    string SavingsLabel,
    string ImageUrl,
    bool InStock);

public sealed record BundleDealItemDto(
    Guid? ProductId,
    string ProductName,
    int Quantity,
    int LengthInches);
