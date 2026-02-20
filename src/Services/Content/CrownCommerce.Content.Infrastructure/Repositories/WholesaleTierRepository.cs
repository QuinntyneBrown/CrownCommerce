using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Repositories;

public sealed class WholesaleTierRepository(ContentDbContext context) : IWholesaleTierRepository
{
    public async Task<IReadOnlyList<WholesaleTier>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.WholesaleTiers
            .AsNoTracking()
            .OrderBy(t => t.SortOrder)
            .ToListAsync(ct);
    }
}
