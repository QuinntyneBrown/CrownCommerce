using CrownCommerce.Content.Application.Dtos;

namespace CrownCommerce.Content.Application.Services;

public interface IContentService
{
    Task<IReadOnlyList<ContentPageDto>> GetAllPagesAsync(CancellationToken ct = default);
    Task<ContentPageDto?> GetPageBySlugAsync(string slug, CancellationToken ct = default);
    Task<IReadOnlyList<FaqItemDto>> GetAllFaqsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<FaqItemDto>> GetFaqsByCategoryAsync(string category, CancellationToken ct = default);
    Task<IReadOnlyList<TestimonialDto>> GetTestimonialsAsync(CancellationToken ct = default);
    Task<TestimonialDto> SubmitTestimonialAsync(CreateTestimonialDto dto, CancellationToken ct = default);
    Task<TestimonialDto> UpdateTestimonialAsync(Guid id, UpdateTestimonialDto dto, CancellationToken ct = default);
    Task DeleteTestimonialAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<GalleryImageDto>> GetGalleryAsync(CancellationToken ct = default);
    Task<IReadOnlyList<GalleryImageDto>> GetGalleryByCategoryAsync(string category, CancellationToken ct = default);
    Task<IReadOnlyList<WholesaleTierDto>> GetWholesaleTiersAsync(CancellationToken ct = default);
    Task<IReadOnlyList<ShippingZoneDto>> GetShippingZonesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<HairCareSectionDto>> GetHairCareSectionsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<AmbassadorBenefitDto>> GetAmbassadorBenefitsAsync(CancellationToken ct = default);
}
