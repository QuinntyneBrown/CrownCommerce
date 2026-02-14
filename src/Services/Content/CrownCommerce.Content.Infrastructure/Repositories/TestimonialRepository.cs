using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Repositories;

public sealed class TestimonialRepository(ContentDbContext context) : ITestimonialRepository
{
    public async Task<IReadOnlyList<Testimonial>> GetApprovedAsync(CancellationToken ct = default)
    {
        return await context.Testimonials
            .AsNoTracking()
            .Where(t => t.IsApproved)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<Testimonial> AddAsync(Testimonial testimonial, CancellationToken ct = default)
    {
        context.Testimonials.Add(testimonial);
        await context.SaveChangesAsync(ct);
        return testimonial;
    }
}
