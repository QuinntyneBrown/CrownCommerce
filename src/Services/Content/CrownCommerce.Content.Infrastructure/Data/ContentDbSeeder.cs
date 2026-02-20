using System.Text.Json;
using CrownCommerce.Content.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Data;

public static class ContentDbSeeder
{
    public static async Task SeedAsync(ContentDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Pages.AnyAsync())
            return;

        var pages = new List<ContentPage>
        {
            new()
            {
                Id = Guid.NewGuid(), Slug = "our-story", Title = "Our Story",
                Body = "Origin Hair Collective was founded with a mission to bring ethically sourced, premium quality hair to conscious consumers. We partner directly with communities across Southeast Asia and South Asia to ensure fair-trade practices and full traceability from source to salon.",
                SortOrder = 1, IsPublished = true, CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), Slug = "hair-care-guide", Title = "Hair Care Guide",
                Body = "Proper care extends the life of your hair. Always use sulfate-free shampoo, detangle gently from ends to roots, and store on a silk or satin surface. Deep condition weekly and avoid excessive heat styling to maintain the natural luster and softness.",
                SortOrder = 2, IsPublished = true, CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), Slug = "shipping-info", Title = "Shipping Information",
                Body = "We offer free standard shipping on orders over $150. Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available for $15. International shipping is available to select countries with delivery in 7-14 business days.",
                SortOrder = 3, IsPublished = true, CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), Slug = "returns-policy", Title = "Returns Policy",
                Body = "We accept returns within 14 days of delivery for unopened, unused products in original packaging. Custom-colored or cut items are final sale. Contact our team to initiate a return and receive a prepaid shipping label.",
                SortOrder = 4, IsPublished = true, CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(), Slug = "ambassador-program", Title = "Ambassador Program",
                Body = "Join the Origin Hair Collective ambassador program and earn commissions while sharing products you love. Ambassadors receive exclusive discounts, early access to new collections, and personalized referral codes. Apply today to become part of our community.",
                SortOrder = 5, IsPublished = true, CreatedAt = DateTime.UtcNow
            }
        };

        context.Pages.AddRange(pages);

        var faqs = new List<FaqItem>
        {
            new() { Id = Guid.NewGuid(), Question = "How long do hair last?", Answer = "With proper care, our virgin hair can last 12-18 months or longer.", Category = "General", SortOrder = 1, IsPublished = true },
            new() { Id = Guid.NewGuid(), Question = "Can I color or bleach the hair?", Answer = "Yes! Our virgin hair has not been chemically processed, so it can be colored, bleached, and styled just like your natural hair.", Category = "General", SortOrder = 2, IsPublished = true },
            new() { Id = Guid.NewGuid(), Question = "What is the difference between bundles, closures, and frontals?", Answer = "Bundles are wefts of hair sewn together. Closures cover a small area (4x4 or 5x5) at the top. Frontals span ear to ear (13x4 or 13x6) for a complete natural hairline.", Category = "Products", SortOrder = 3, IsPublished = true },
            new() { Id = Guid.NewGuid(), Question = "How do I determine the right length?", Answer = "Measure from the crown of your head down to where you want the hair to fall. Our lengths are measured when the hair is straight.", Category = "Products", SortOrder = 4, IsPublished = true },
            new() { Id = Guid.NewGuid(), Question = "Do you offer wholesale pricing?", Answer = "Yes! We offer wholesale pricing for salons and stylists. Use our contact form to inquire about wholesale accounts and minimum order quantities.", Category = "Orders", SortOrder = 5, IsPublished = true },
            new() { Id = Guid.NewGuid(), Question = "What payment methods do you accept?", Answer = "We accept all major credit cards, debit cards, and bank transfers through our secure payment system.", Category = "Orders", SortOrder = 6, IsPublished = true }
        };

        context.Faqs.AddRange(faqs);

        var testimonials = new List<Testimonial>
        {
            new() { Id = Guid.NewGuid(), CustomerName = "Sarah M.", CustomerLocation = "Atlanta, GA", Content = "The quality of the Cambodian straight bundles is unmatched. I've been wearing them for 8 months and they still look brand new!", Rating = 5, IsApproved = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), CustomerName = "Jessica T.", CustomerLocation = "Houston, TX", Content = "I love knowing exactly where my hair comes from. The traceability Origin provides gives me peace of mind. Beautiful hair, ethical sourcing.", Rating = 5, IsApproved = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), CustomerName = "Aaliyah R.", CustomerLocation = "Brooklyn, NY", Content = "The Indian curly bundles hold their pattern perfectly even after washing. Best hair I've ever purchased, and the customer service is amazing.", Rating = 5, IsApproved = true, CreatedAt = DateTime.UtcNow }
        };

        context.Testimonials.AddRange(testimonials);

        var galleryImages = new List<GalleryImage>
        {
            new() { Id = Guid.NewGuid(), Title = "Cambodian Straight Install", Description = "Sleek straight install using our Cambodian virgin bundles", ImageUrl = "/images/gallery/cambodian-straight-install.jpg", Category = "Installs", SortOrder = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Indian Curly Transformation", Description = "Beautiful curly look achieved with Indian temple hair", ImageUrl = "/images/gallery/indian-curly-transformation.jpg", Category = "Installs", SortOrder = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Vietnamese Body Wave", Description = "Gorgeous body wave style with Vietnamese raw hair", ImageUrl = "/images/gallery/vietnamese-body-wave.jpg", Category = "Installs", SortOrder = 3, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Burmese Deep Wave Sew-In", Description = "Full sew-in using Burmese deep wave bundles with frontal", ImageUrl = "/images/gallery/burmese-deep-wave.jpg", Category = "Installs", SortOrder = 4, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Origin Community Event", Description = "Our team at the annual hair expo connecting with stylists", ImageUrl = "/images/gallery/community-event.jpg", Category = "Community", SortOrder = 5, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Stylist Spotlight: Crown Studio", Description = "Partner salon Crown Studio showcasing Origin Hair installs", ImageUrl = "/images/gallery/stylist-spotlight.jpg", Category = "Community", SortOrder = 6, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Behind the Scenes: Sourcing Trip", Description = "Our sourcing team visiting partner communities in Southeast Asia", ImageUrl = "/images/gallery/sourcing-trip.jpg", Category = "Behind the Scenes", SortOrder = 7, IsPublished = true, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Title = "Custom Color: Honey Blonde", Description = "Custom honey blonde color on Cambodian straight bundles", ImageUrl = "/images/gallery/custom-color-blonde.jpg", Category = "Installs", SortOrder = 8, IsPublished = true, CreatedAt = DateTime.UtcNow }
        };

        context.GalleryImages.AddRange(galleryImages);

        // Seed wholesale tiers
        var wholesaleTiers = new List<WholesaleTier>
        {
            new() { Id = Guid.NewGuid(), Name = "Starter", MinQuantity = 5, MaxQuantity = 19, DiscountPercentage = 10, Description = "Perfect for new salon owners getting started. Order 5-19 units and save 10% on every order.", SortOrder = 0 },
            new() { Id = Guid.NewGuid(), Name = "Professional", MinQuantity = 20, MaxQuantity = 49, DiscountPercentage = 15, Description = "For established salons with consistent demand. Order 20-49 units and enjoy 15% off.", SortOrder = 1 },
            new() { Id = Guid.NewGuid(), Name = "Elite", MinQuantity = 50, MaxQuantity = 99, DiscountPercentage = 20, Description = "High-volume partner pricing for boutiques and distributors. 50-99 units at 20% off.", SortOrder = 2 },
            new() { Id = Guid.NewGuid(), Name = "Enterprise", MinQuantity = 100, MaxQuantity = null, DiscountPercentage = 25, Description = "Custom enterprise pricing for large-scale operations. 100+ units with 25% discount and dedicated account manager.", SortOrder = 3 }
        };
        context.WholesaleTiers.AddRange(wholesaleTiers);

        // Seed shipping zones
        var shippingZones = new List<ShippingZone>
        {
            new() { Id = Guid.NewGuid(), Name = "Domestic Standard", Region = "United States (Continental)", StandardRate = 0, StandardDeliveryDays = "5-7 business days", ExpressRate = 15.00m, ExpressDeliveryDays = "2-3 business days", FreeShippingThreshold = 150.00m, SortOrder = 0 },
            new() { Id = Guid.NewGuid(), Name = "Alaska & Hawaii", Region = "United States (Non-Continental)", StandardRate = 12.00m, StandardDeliveryDays = "7-10 business days", ExpressRate = 25.00m, ExpressDeliveryDays = "3-5 business days", FreeShippingThreshold = 200.00m, SortOrder = 1 },
            new() { Id = Guid.NewGuid(), Name = "Canada", Region = "Canada", StandardRate = 18.00m, StandardDeliveryDays = "7-14 business days", ExpressRate = 35.00m, ExpressDeliveryDays = "3-5 business days", FreeShippingThreshold = 250.00m, SortOrder = 2 },
            new() { Id = Guid.NewGuid(), Name = "International", Region = "Europe, Australia, Caribbean", StandardRate = 25.00m, StandardDeliveryDays = "10-21 business days", ExpressRate = 50.00m, ExpressDeliveryDays = "5-10 business days", FreeShippingThreshold = 350.00m, SortOrder = 3 }
        };
        context.ShippingZones.AddRange(shippingZones);

        // Seed hair care sections
        var hairCareSections = new List<HairCareSection>
        {
            new() { Id = Guid.NewGuid(), Title = "Washing & Conditioning", Description = "Proper washing technique extends the life of your virgin hair significantly. Use gentle products and avoid harsh chemicals.", IconName = "droplet", TipsJson = JsonSerializer.Serialize(new[] { "Use sulfate-free shampoo and conditioner", "Wash in a downward motion to prevent tangling", "Deep condition weekly with a protein treatment", "Rinse with cool water to seal cuticles", "Never sleep with wet hair extensions" }), SortOrder = 0 },
            new() { Id = Guid.NewGuid(), Title = "Styling & Heat Protection", Description = "While our hair can withstand heat styling, proper protection ensures longevity and maintains the natural texture.", IconName = "flame", TipsJson = JsonSerializer.Serialize(new[] { "Always apply heat protectant before styling", "Keep heat tools below 350°F for regular use", "Allow hair to air dry when possible", "Use a wide-tooth comb to detangle gently", "Style from ends to roots to prevent breakage" }), SortOrder = 1 },
            new() { Id = Guid.NewGuid(), Title = "Nighttime Care", Description = "How you care for your hair at night makes a huge difference in how long it lasts and how it looks each morning.", IconName = "moon", TipsJson = JsonSerializer.Serialize(new[] { "Wrap hair in a silk or satin scarf", "Use a satin pillowcase if not wrapping", "Braid or twist hair loosely before bed", "Never go to bed with tangled hair", "Apply a light leave-in conditioner before wrapping" }), SortOrder = 2 },
            new() { Id = Guid.NewGuid(), Title = "Color & Chemical Treatments", Description = "Our virgin hair accepts color beautifully. Follow these guidelines for the best results when coloring or treating.", IconName = "palette", TipsJson = JsonSerializer.Serialize(new[] { "Always do a strand test before full application", "Use professional-grade coloring products", "Avoid bleaching more than two shades lighter", "Wait at least 48 hours between chemical treatments", "Deep condition after every color treatment" }), SortOrder = 3 }
        };
        context.HairCareSections.AddRange(hairCareSections);

        // Seed ambassador benefits
        var ambassadorBenefits = new List<AmbassadorBenefit>
        {
            new() { Id = Guid.NewGuid(), Title = "Exclusive Discounts", Description = "Enjoy 25% off all products for personal use and access to ambassador-only flash sales throughout the year.", IconName = "tag", SortOrder = 0 },
            new() { Id = Guid.NewGuid(), Title = "Commission Earnings", Description = "Earn 15% commission on every sale made through your unique referral code. Paid monthly via direct deposit.", IconName = "dollar-sign", SortOrder = 1 },
            new() { Id = Guid.NewGuid(), Title = "Early Access", Description = "Be the first to try new collections and products before they launch to the public. Share exclusive previews with your audience.", IconName = "clock", SortOrder = 2 },
            new() { Id = Guid.NewGuid(), Title = "Free Products", Description = "Receive complimentary products each quarter to create content, review, and share with your community.", IconName = "gift", SortOrder = 3 },
            new() { Id = Guid.NewGuid(), Title = "Community & Support", Description = "Join our private ambassador community for networking, tips, and direct access to the Origin Hair team.", IconName = "users", SortOrder = 4 }
        };
        context.AmbassadorBenefits.AddRange(ambassadorBenefits);

        await context.SaveChangesAsync();
    }
}
