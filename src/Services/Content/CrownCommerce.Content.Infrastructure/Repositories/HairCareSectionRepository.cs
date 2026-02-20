using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Repositories;

public sealed class HairCareSectionRepository(ContentDbContext context) : IHairCareSectionRepository
{
    public async Task<IReadOnlyList<HairCareSection>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.HairCareSections
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .ToListAsync(ct);
    }
}
