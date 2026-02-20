namespace CrownCommerce.Content.Core.Entities;

public sealed class WholesaleTier
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public int MinQuantity { get; set; }
    public int? MaxQuantity { get; set; }
    public decimal DiscountPercentage { get; set; }
    public required string Description { get; set; }
    public int SortOrder { get; set; }
}
