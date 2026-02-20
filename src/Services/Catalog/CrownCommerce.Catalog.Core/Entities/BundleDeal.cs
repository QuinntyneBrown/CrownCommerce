namespace CrownCommerce.Catalog.Core.Entities;

public sealed class BundleDeal
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal DealPrice { get; set; }
    public decimal SavingsAmount { get; set; }
    public required string SavingsLabel { get; set; }
    public required string ImageUrl { get; set; }
    public bool InStock { get; set; }
    public int SortOrder { get; set; }
    public ICollection<BundleDealItem> Items { get; set; } = [];
}
