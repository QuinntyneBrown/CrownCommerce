namespace CrownCommerce.Shared.Contracts;

public sealed record ProductCatalogChangedEvent(
    IReadOnlyList<ProductCatalogChangedEvent.ProductData> Products,
    IReadOnlyList<ProductCatalogChangedEvent.OriginData> Origins,
    DateTime OccurredAt)
{
    public sealed record ProductData(
        string Name,
        string Description,
        string Origin,
        string Texture,
        string Type,
        int LengthInches,
        decimal Price);

    public sealed record OriginData(
        string Country,
        string Region,
        string Description);
}
