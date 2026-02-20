using System.Text.Json;
using CrownCommerce.Catalog.Application.Dtos;
using CrownCommerce.Catalog.Core.Entities;

namespace CrownCommerce.Catalog.Application.Mapping;

public static class CatalogMappingExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public static HairProductDto ToDto(this HairProduct product)
    {
        var availableLengths = DeserializeJson<int[]>(product.AvailableLengthsJson) ?? [];
        var features = DeserializeJson<string[]>(product.FeaturesJson) ?? [];
        var imageUrls = product.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToArray();

        return new(
            product.Id,
            product.Name,
            product.OriginId,
            product.Origin?.Country ?? string.Empty,
            product.Texture.ToString(),
            product.Type.ToString(),
            product.Type.ToString().ToLowerInvariant(),
            product.LengthInches,
            product.Price,
            product.Description,
            product.ImageUrl,
            imageUrls,
            product.Rating,
            product.ReviewCount,
            availableLengths,
            features,
            product.InStock);
    }

    public static ProductDetailDto ToDetailDto(this HairProduct product)
    {
        var availableLengths = DeserializeJson<int[]>(product.AvailableLengthsJson) ?? [];
        var features = DeserializeJson<string[]>(product.FeaturesJson) ?? [];
        var images = product.Images.OrderBy(i => i.SortOrder).Select(i => i.ToDto()).ToList();
        var typeName = product.Type.ToString();

        var breadcrumb = new List<BreadcrumbItemDto>
        {
            new("Shop", "/shop"),
            new($"{typeName}s", $"/{typeName.ToLowerInvariant()}s"),
            new(product.Texture.ToString(), $"/{typeName.ToLowerInvariant()}s?texture={product.Texture.ToString().ToLowerInvariant()}")
        };

        return new(
            product.Id,
            product.Name,
            product.OriginId,
            product.Origin?.Country ?? string.Empty,
            product.Texture.ToString(),
            typeName,
            typeName.ToLowerInvariant(),
            product.LengthInches,
            product.Price,
            product.Description,
            images,
            product.Rating,
            product.ReviewCount,
            availableLengths,
            features,
            product.InStock,
            breadcrumb);
    }

    public static ProductImageDto ToDto(this ProductImage image) =>
        new(image.Id, image.ProductId, image.Url, image.AltText, image.SortOrder);

    public static ProductReviewDto ToDto(this ProductReview review) =>
        new(review.Id, review.ProductId, review.CustomerName, review.Rating, review.Content, review.CreatedAt);

    public static BundleDealDto ToDto(this BundleDeal deal) =>
        new(deal.Id, deal.Name, deal.Description,
            deal.Items.Select(i => new BundleDealItemDto(i.ProductId, i.ProductName, i.Quantity, i.LengthInches)).ToList(),
            deal.OriginalPrice, deal.DealPrice, deal.SavingsAmount, deal.SavingsLabel, deal.ImageUrl, deal.InStock);

    public static HairOriginDto ToDto(this HairOrigin origin) =>
        new(origin.Id, origin.Country, origin.Region, origin.Description);

    private static T? DeserializeJson<T>(string? json) where T : class
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try { return JsonSerializer.Deserialize<T>(json, JsonOptions); }
        catch { return null; }
    }
}
