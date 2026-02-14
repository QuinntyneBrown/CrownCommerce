using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Repositories;

public sealed class FaqRepository(ContentDbContext context) : IFaqRepository
{
    public async Task<IReadOnlyList<FaqItem>> GetAllPublishedAsync(CancellationToken ct = default)
    {
        return await context.Faqs
            .AsNoTracking()
            .Where(f => f.IsPublished)
            .OrderBy(f => f.SortOrder)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<FaqItem>> GetByCategoryAsync(string category, CancellationToken ct = default)
    {
        return await context.Faqs
            .AsNoTracking()
            .Where(f => f.IsPublished && f.Category == category)
            .OrderBy(f => f.SortOrder)
            .ToListAsync(ct);
    }

    public async Task<FaqItem> AddAsync(FaqItem faq, CancellationToken ct = default)
    {
        context.Faqs.Add(faq);
        await context.SaveChangesAsync(ct);
        return faq;
    }
}
