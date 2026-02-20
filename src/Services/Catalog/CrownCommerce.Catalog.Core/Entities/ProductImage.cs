namespace CrownCommerce.Catalog.Core.Entities;

public sealed class ProductImage
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public required string Url { get; set; }
    public required string AltText { get; set; }
    public int SortOrder { get; set; }
    public HairProduct? Product { get; set; }
}
