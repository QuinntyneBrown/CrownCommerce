using CrownCommerce.Content.Application.Dtos;
using CrownCommerce.Content.Application.Mapping;
using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;

namespace CrownCommerce.Content.Application.Services;

public sealed class ContentService(
    IContentPageRepository pageRepository,
    IFaqRepository faqRepository,
    ITestimonialRepository testimonialRepository,
    IGalleryRepository galleryRepository,
    IWholesaleTierRepository wholesaleTierRepository,
    IShippingZoneRepository shippingZoneRepository,
    IHairCareSectionRepository hairCareSectionRepository,
    IAmbassadorBenefitRepository ambassadorBenefitRepository) : IContentService
{
    public async Task<IReadOnlyList<ContentPageDto>> GetAllPagesAsync(CancellationToken ct = default)
    {
        var pages = await pageRepository.GetAllPublishedAsync(ct);
        return pages.Select(p => p.ToDto()).ToList();
    }

    public async Task<ContentPageDto?> GetPageBySlugAsync(string slug, CancellationToken ct = default)
    {
        var page = await pageRepository.GetBySlugAsync(slug, ct);
        return page?.ToDto();
    }

    public async Task<IReadOnlyList<FaqItemDto>> GetAllFaqsAsync(CancellationToken ct = default)
    {
        var faqs = await faqRepository.GetAllPublishedAsync(ct);
        return faqs.Select(f => f.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<FaqItemDto>> GetFaqsByCategoryAsync(string category, CancellationToken ct = default)
    {
        var faqs = await faqRepository.GetByCategoryAsync(category, ct);
        return faqs.Select(f => f.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<TestimonialDto>> GetTestimonialsAsync(CancellationToken ct = default)
    {
        var testimonials = await testimonialRepository.GetApprovedAsync(ct);
        return testimonials.Select(t => t.ToDto()).ToList();
    }

    public async Task<TestimonialDto> SubmitTestimonialAsync(CreateTestimonialDto dto, CancellationToken ct = default)
    {
        var testimonial = new Testimonial
        {
            Id = Guid.NewGuid(),
            CustomerName = dto.CustomerName,
            CustomerLocation = dto.CustomerLocation,
            Content = dto.Content,
            Rating = dto.Rating,
            ImageUrl = dto.ImageUrl,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow
        };

        await testimonialRepository.AddAsync(testimonial, ct);
        return testimonial.ToDto();
    }

    public async Task<TestimonialDto> UpdateTestimonialAsync(Guid id, UpdateTestimonialDto dto, CancellationToken ct = default)
    {
        var existing = await testimonialRepository.GetByIdAsync(id, ct)
            ?? throw new InvalidOperationException($"Testimonial {id} not found");

        var testimonial = new Testimonial
        {
            Id = id,
            CustomerName = dto.CustomerName,
            CustomerLocation = dto.CustomerLocation,
            Content = dto.Content,
            Rating = dto.Rating,
            ImageUrl = dto.ImageUrl,
            IsApproved = existing.IsApproved,
            CreatedAt = existing.CreatedAt,
        };

        var updated = await testimonialRepository.UpdateAsync(testimonial, ct);
        return updated.ToDto();
    }

    public async Task DeleteTestimonialAsync(Guid id, CancellationToken ct = default)
    {
        await testimonialRepository.DeleteAsync(id, ct);
    }

    public async Task<IReadOnlyList<GalleryImageDto>> GetGalleryAsync(CancellationToken ct = default)
    {
        var images = await galleryRepository.GetAllPublishedAsync(ct);
        return images.Select(i => i.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<GalleryImageDto>> GetGalleryByCategoryAsync(string category, CancellationToken ct = default)
    {
        var images = await galleryRepository.GetByCategoryAsync(category, ct);
        return images.Select(i => i.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<WholesaleTierDto>> GetWholesaleTiersAsync(CancellationToken ct = default)
    {
        var tiers = await wholesaleTierRepository.GetAllAsync(ct);
        return tiers.Select(t => t.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<ShippingZoneDto>> GetShippingZonesAsync(CancellationToken ct = default)
    {
        var zones = await shippingZoneRepository.GetAllAsync(ct);
        return zones.Select(z => z.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<HairCareSectionDto>> GetHairCareSectionsAsync(CancellationToken ct = default)
    {
        var sections = await hairCareSectionRepository.GetAllAsync(ct);
        return sections.Select(s => s.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<AmbassadorBenefitDto>> GetAmbassadorBenefitsAsync(CancellationToken ct = default)
    {
        var benefits = await ambassadorBenefitRepository.GetAllAsync(ct);
        return benefits.Select(b => b.ToDto()).ToList();
    }
}
