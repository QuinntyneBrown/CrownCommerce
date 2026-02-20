using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Interfaces;
using CrownCommerce.Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Catalog.Infrastructure.Repositories;

public sealed class BundleDealRepository(CatalogDbContext context) : IBundleDealRepository
{
    public async Task<IReadOnlyList<BundleDeal>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.BundleDeals
            .AsNoTracking()
            .Include(d => d.Items)
            .OrderBy(d => d.SortOrder)
            .ToListAsync(ct);
    }

    public async Task<BundleDeal?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.BundleDeals
            .AsNoTracking()
            .Include(d => d.Items)
            .FirstOrDefaultAsync(d => d.Id == id, ct);
    }
}
