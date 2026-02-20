namespace CrownCommerce.Catalog.Core.Entities;

public sealed class ProductReview
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public required string CustomerName { get; set; }
    public int Rating { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public HairProduct? Product { get; set; }
}
