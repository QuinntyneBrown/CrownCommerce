using CrownCommerce.Content.Core.Entities;

namespace CrownCommerce.Content.Core.Interfaces;

public interface ITestimonialRepository
{
    Task<IReadOnlyList<Testimonial>> GetApprovedAsync(CancellationToken ct = default);
    Task<Testimonial?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Testimonial> AddAsync(Testimonial testimonial, CancellationToken ct = default);
    Task<Testimonial> UpdateAsync(Testimonial testimonial, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
