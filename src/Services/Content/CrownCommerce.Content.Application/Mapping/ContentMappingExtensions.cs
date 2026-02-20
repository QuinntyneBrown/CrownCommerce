using System.Text.Json;
using CrownCommerce.Content.Application.Dtos;
using CrownCommerce.Content.Core.Entities;

namespace CrownCommerce.Content.Application.Mapping;

public static class ContentMappingExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public static ContentPageDto ToDto(this ContentPage page) =>
        new(page.Id, page.Slug, page.Title, page.Body, page.CreatedAt);

    public static FaqItemDto ToDto(this FaqItem faq) =>
        new(faq.Id, faq.Question, faq.Answer, faq.Category);

    public static TestimonialDto ToDto(this Testimonial testimonial) =>
        new(testimonial.Id, testimonial.CustomerName, testimonial.CustomerLocation,
            testimonial.Content, testimonial.Rating, testimonial.ImageUrl, testimonial.CreatedAt);

    public static GalleryImageDto ToDto(this GalleryImage image) =>
        new(image.Id, image.Title, image.Description, image.ImageUrl, image.Category, image.CreatedAt);

    public static WholesaleTierDto ToDto(this WholesaleTier tier) =>
        new(tier.Id, tier.Name, tier.MinQuantity, tier.MaxQuantity, tier.DiscountPercentage, tier.Description);

    public static ShippingZoneDto ToDto(this ShippingZone zone) =>
        new(zone.Id, zone.Name, zone.Region, zone.StandardRate, zone.StandardDeliveryDays,
            zone.ExpressRate, zone.ExpressDeliveryDays, zone.FreeShippingThreshold);

    public static HairCareSectionDto ToDto(this HairCareSection section)
    {
        var tips = DeserializeJson<string[]>(section.TipsJson) ?? [];
        return new(section.Id, section.Title, section.Description, section.IconName, tips);
    }

    public static AmbassadorBenefitDto ToDto(this AmbassadorBenefit benefit) =>
        new(benefit.Id, benefit.Title, benefit.Description, benefit.IconName);

    private static T? DeserializeJson<T>(string? json) where T : class
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try { return JsonSerializer.Deserialize<T>(json, JsonOptions); }
        catch { return null; }
    }
}
