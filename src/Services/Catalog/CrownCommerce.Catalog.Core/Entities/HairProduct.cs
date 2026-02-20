using CrownCommerce.Catalog.Core.Enums;

namespace CrownCommerce.Catalog.Core.Entities;

public sealed class HairProduct
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public Guid OriginId { get; set; }
    public HairTexture Texture { get; set; }
    public HairType Type { get; set; }
    public int LengthInches { get; set; }
    public decimal Price { get; set; }
    public required string Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool InStock { get; set; } = true;
    public string AvailableLengthsJson { get; set; } = "[]";
    public string FeaturesJson { get; set; } = "[]";
    public DateTime CreatedAt { get; set; }
    public HairOrigin? Origin { get; set; }
    public ICollection<ProductImage> Images { get; set; } = [];
    public ICollection<ProductReview> Reviews { get; set; } = [];
}
