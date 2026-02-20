using System.Text.Json;
using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Catalog.Infrastructure.Data;

public static class CatalogDbSeeder
{
    public static async Task SeedAsync(CatalogDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Origins.AnyAsync())
            return;

        var cambodia = new HairOrigin
        {
            Id = Guid.NewGuid(),
            Country = "Cambodia",
            Region = "Southeast Asia",
            Description = "Cambodian hair is renowned for its natural thickness and durability. Sourced from rural communities, it maintains its integrity through minimal chemical processing."
        };

        var indonesia = new HairOrigin
        {
            Id = Guid.NewGuid(),
            Country = "Indonesia",
            Region = "Southeast Asia",
            Description = "Indonesian hair offers a naturally silky texture with a slight wave. Ethically sourced from temple donations and direct partnerships."
        };

        var india = new HairOrigin
        {
            Id = Guid.NewGuid(),
            Country = "India",
            Region = "South Asia",
            Description = "Indian hair is versatile and available in a wide range of textures. Sourced from temples and cooperatives across the subcontinent."
        };

        var vietnam = new HairOrigin
        {
            Id = Guid.NewGuid(),
            Country = "Vietnam",
            Region = "Southeast Asia",
            Description = "Vietnamese hair is prized for its strength and natural straight texture. Our partnerships ensure fair-trade sourcing from local communities."
        };

        var myanmar = new HairOrigin
        {
            Id = Guid.NewGuid(),
            Country = "Myanmar",
            Region = "Southeast Asia",
            Description = "Myanmar hair is exceptionally soft and lightweight. We work with ethical suppliers to bring you the finest quality raw hair."
        };

        context.Origins.AddRange(cambodia, indonesia, india, vietnam, myanmar);

        var now = DateTime.UtcNow;

        var products = new List<HairProduct>
        {
            new()
            {
                Id = Guid.NewGuid(), Name = "Cambodian Straight Bundle", OriginId = cambodia.Id,
                Texture = HairTexture.Straight, Type = HairType.Bundle, LengthInches = 18, Price = 185.00m,
                Description = "Premium raw Cambodian straight hair bundle. Natural color, single donor, cuticle aligned.",
                ImageUrl = "/images/cambodian-straight-bundle.jpg",
                Rating = 4.8m, ReviewCount = 124, InStock = true, CreatedAt = now.AddDays(-90),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 14, 16, 18, 20, 22, 24 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Single donor", "Cuticle aligned", "Natural color", "Minimal shedding" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Cambodian Wavy Bundle", OriginId = cambodia.Id,
                Texture = HairTexture.Wavy, Type = HairType.Bundle, LengthInches = 20, Price = 210.00m,
                Description = "Luxurious Cambodian wavy bundle with a natural body wave pattern. Minimal shedding guaranteed.",
                ImageUrl = "/images/cambodian-wavy-bundle.jpg",
                Rating = 4.7m, ReviewCount = 89, InStock = true, CreatedAt = now.AddDays(-85),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 16, 18, 20, 22, 24, 26 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Body wave pattern", "Minimal shedding", "Raw unprocessed", "Can be colored" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Indonesian Silky Straight Bundle", OriginId = indonesia.Id,
                Texture = HairTexture.Straight, Type = HairType.Bundle, LengthInches = 22, Price = 195.00m,
                Description = "Silky smooth Indonesian straight hair. Lightweight and easy to maintain.",
                ImageUrl = "/images/indonesian-silky-straight.jpg",
                Rating = 4.6m, ReviewCount = 67, InStock = true, CreatedAt = now.AddDays(-80),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 14, 16, 18, 20, 22, 24, 26, 28 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Silky texture", "Lightweight", "Easy maintenance", "Natural sheen" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Indonesian Curly Closure", OriginId = indonesia.Id,
                Texture = HairTexture.Curly, Type = HairType.Closure, LengthInches = 16, Price = 150.00m,
                Description = "4x4 lace closure with natural Indonesian curly pattern. Pre-plucked hairline.",
                ImageUrl = "/images/indonesian-curly-closure.jpg",
                Rating = 4.5m, ReviewCount = 43, InStock = true, CreatedAt = now.AddDays(-75),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 12, 14, 16, 18 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "4x4 lace", "Pre-plucked", "Natural hairline", "Bleached knots" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Indian Curly Bundle", OriginId = india.Id,
                Texture = HairTexture.Curly, Type = HairType.Bundle, LengthInches = 24, Price = 175.00m,
                Description = "Deep curly Indian hair bundle. Rich, bouncy curls that hold their pattern after washing.",
                ImageUrl = "/images/indian-curly-bundle.jpg",
                Rating = 4.9m, ReviewCount = 156, InStock = true, CreatedAt = now.AddDays(-70),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 14, 16, 18, 20, 22, 24 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Deep curl pattern", "Bouncy curls", "Wash & go friendly", "Long lasting" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Indian Wavy Frontal", OriginId = india.Id,
                Texture = HairTexture.Wavy, Type = HairType.Frontal, LengthInches = 18, Price = 220.00m,
                Description = "13x4 lace frontal with natural Indian body wave. HD lace for seamless blending.",
                ImageUrl = "/images/indian-wavy-frontal.jpg",
                Rating = 4.7m, ReviewCount = 78, InStock = true, CreatedAt = now.AddDays(-65),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 14, 16, 18, 20 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "13x4 lace", "HD lace", "Pre-plucked", "Baby hairs" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Indian Kinky Straight Bundle", OriginId = india.Id,
                Texture = HairTexture.Kinky, Type = HairType.Bundle, LengthInches = 16, Price = 165.00m,
                Description = "Natural kinky straight texture that mimics relaxed African hair. Blends beautifully.",
                ImageUrl = "/images/indian-kinky-straight.jpg",
                Rating = 4.8m, ReviewCount = 92, InStock = true, CreatedAt = now.AddDays(-60),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 12, 14, 16, 18, 20, 22 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Kinky straight texture", "Natural blend", "Versatile styling", "Minimal maintenance" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Vietnamese Straight Bundle", OriginId = vietnam.Id,
                Texture = HairTexture.Straight, Type = HairType.Bundle, LengthInches = 26, Price = 230.00m,
                Description = "Ultra-long Vietnamese straight hair. Bone straight with a natural sheen.",
                ImageUrl = "/images/vietnamese-straight-bundle.jpg",
                Rating = 4.6m, ReviewCount = 54, InStock = true, CreatedAt = now.AddDays(-55),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 18, 20, 22, 24, 26, 28, 30 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Bone straight", "Natural sheen", "Ultra-long lengths", "Single donor" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Vietnamese Wavy Wig", OriginId = vietnam.Id,
                Texture = HairTexture.Wavy, Type = HairType.Wig, LengthInches = 20, Price = 450.00m,
                Description = "Full lace wig with Vietnamese wavy hair. Pre-styled and ready to wear.",
                ImageUrl = "/images/vietnamese-wavy-wig.jpg",
                Rating = 4.9m, ReviewCount = 201, InStock = true, CreatedAt = now.AddDays(-50),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 16, 18, 20, 22, 24 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Full lace cap", "Pre-styled", "Adjustable straps", "Natural hairline" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Vietnamese Curly Bundle", OriginId = vietnam.Id,
                Texture = HairTexture.Curly, Type = HairType.Bundle, LengthInches = 18, Price = 200.00m,
                Description = "Natural curly Vietnamese hair bundle. Soft, defined curls with zero processing.",
                ImageUrl = "/images/vietnamese-curly-bundle.jpg",
                Rating = 4.5m, ReviewCount = 38, InStock = true, CreatedAt = now.AddDays(-45),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 14, 16, 18, 20, 22 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Defined curls", "Zero processing", "Soft texture", "True to length" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Myanmar Straight Closure", OriginId = myanmar.Id,
                Texture = HairTexture.Straight, Type = HairType.Closure, LengthInches = 14, Price = 130.00m,
                Description = "5x5 HD lace closure with Myanmar straight hair. Feather-light and undetectable.",
                ImageUrl = "/images/myanmar-straight-closure.jpg",
                Rating = 4.4m, ReviewCount = 29, InStock = true, CreatedAt = now.AddDays(-40),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 10, 12, 14, 16, 18 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "5x5 lace", "HD lace", "Feather-light", "Undetectable" })
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Myanmar Wavy Bundle", OriginId = myanmar.Id,
                Texture = HairTexture.Wavy, Type = HairType.Bundle, LengthInches = 20, Price = 190.00m,
                Description = "Raw Myanmar wavy hair bundle. Gorgeous natural wave with exceptional softness.",
                ImageUrl = "/images/myanmar-wavy-bundle.jpg",
                Rating = 4.7m, ReviewCount = 61, InStock = true, CreatedAt = now.AddDays(-35),
                AvailableLengthsJson = JsonSerializer.Serialize(new[] { 14, 16, 18, 20, 22, 24 }),
                FeaturesJson = JsonSerializer.Serialize(new[] { "Natural wave", "Exceptional softness", "Raw unprocessed", "Ethically sourced" })
            }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();

        // Seed product images
        var images = new List<ProductImage>();
        foreach (var product in products)
        {
            var baseName = product.Name.ToLowerInvariant().Replace(" ", "-");
            images.Add(new ProductImage
            {
                Id = Guid.NewGuid(), ProductId = product.Id,
                Url = product.ImageUrl ?? $"/images/{baseName}.jpg",
                AltText = $"{product.Name} - Main Image", SortOrder = 0
            });
            images.Add(new ProductImage
            {
                Id = Guid.NewGuid(), ProductId = product.Id,
                Url = $"/images/{baseName}-angle.jpg",
                AltText = $"{product.Name} - Angle View", SortOrder = 1
            });
            images.Add(new ProductImage
            {
                Id = Guid.NewGuid(), ProductId = product.Id,
                Url = $"/images/{baseName}-detail.jpg",
                AltText = $"{product.Name} - Close Up Detail", SortOrder = 2
            });
        }
        context.ProductImages.AddRange(images);

        // Seed product reviews
        var reviewNames = new[] { "Sarah M.", "Jessica T.", "Alicia K.", "Michelle R.", "Tanya P.", "Diana L." };
        var reviewContents = new[]
        {
            "Absolutely love this hair! The quality is incredible and it blends seamlessly with my natural hair.",
            "This is the best hair I've ever purchased. It's so soft and the texture is perfect.",
            "Great value for the price. The hair arrived quickly and was exactly as described.",
            "I've been buying from this brand for years and the quality never disappoints. Highly recommend!",
            "The hair is gorgeous and holds up well after multiple washes. Will definitely repurchase.",
            "Amazing quality! My stylist was impressed with how well it installed and how natural it looks."
        };

        var reviews = new List<ProductReview>();
        var rng = new Random(42);
        foreach (var product in products)
        {
            var reviewCount = rng.Next(2, 5);
            for (var i = 0; i < reviewCount; i++)
            {
                reviews.Add(new ProductReview
                {
                    Id = Guid.NewGuid(), ProductId = product.Id,
                    CustomerName = reviewNames[rng.Next(reviewNames.Length)],
                    Rating = rng.Next(4, 6),
                    Content = reviewContents[rng.Next(reviewContents.Length)],
                    CreatedAt = now.AddDays(-rng.Next(1, 60))
                });
            }
        }
        context.ProductReviews.AddRange(reviews);

        // Seed bundle deals
        var bundleProducts = products.Where(p => p.Type == HairType.Bundle).Take(3).ToList();
        var bundleDeals = new List<BundleDeal>
        {
            new()
            {
                Id = Guid.NewGuid(), Name = "Straight Hair Starter Bundle",
                Description = "Everything you need for a complete straight hair install. Includes 3 bundles for full coverage.",
                OriginalPrice = 555.00m, DealPrice = 469.99m, SavingsAmount = 85.01m, SavingsLabel = "Save $85",
                ImageUrl = "/images/straight-starter-bundle.jpg", InStock = true, SortOrder = 0,
                Items = bundleProducts.Select((p, i) => new BundleDealItem
                {
                    Id = Guid.NewGuid(), ProductName = p.Name, ProductId = p.Id, Quantity = 1, LengthInches = p.LengthInches
                }).ToList()
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Curly Hair Complete Set",
                Description = "Our best-selling curly bundles paired together for a voluminous, natural look.",
                OriginalPrice = 575.00m, DealPrice = 489.99m, SavingsAmount = 85.01m, SavingsLabel = "Save $85",
                ImageUrl = "/images/curly-complete-set.jpg", InStock = true, SortOrder = 1,
                Items = products.Where(p => p.Texture == HairTexture.Curly).Take(3).Select((p, i) => new BundleDealItem
                {
                    Id = Guid.NewGuid(), ProductName = p.Name, ProductId = p.Id, Quantity = 1, LengthInches = p.LengthInches
                }).ToList()
            },
            new()
            {
                Id = Guid.NewGuid(), Name = "Bundle + Closure Deal",
                Description = "Two premium bundles with a matching closure for a flawless install from start to finish.",
                OriginalPrice = 520.00m, DealPrice = 439.99m, SavingsAmount = 80.01m, SavingsLabel = "Save $80",
                ImageUrl = "/images/bundle-closure-deal.jpg", InStock = true, SortOrder = 2,
                Items = new List<BundleDealItem>
                {
                    new() { Id = Guid.NewGuid(), ProductName = products[0].Name, ProductId = products[0].Id, Quantity = 2, LengthInches = 18 },
                    new() { Id = Guid.NewGuid(), ProductName = products[3].Name, ProductId = products[3].Id, Quantity = 1, LengthInches = 16 }
                }
            }
        };

        context.BundleDeals.AddRange(bundleDeals);
        await context.SaveChangesAsync();
    }
}
