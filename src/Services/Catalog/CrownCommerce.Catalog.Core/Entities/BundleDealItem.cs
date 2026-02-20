namespace CrownCommerce.Catalog.Core.Entities;

public sealed class BundleDealItem
{
    public Guid Id { get; set; }
    public Guid BundleDealId { get; set; }
    public Guid? ProductId { get; set; }
    public required string ProductName { get; set; }
    public int Quantity { get; set; }
    public int LengthInches { get; set; }
    public BundleDeal? BundleDeal { get; set; }
}
