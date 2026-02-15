using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Interfaces;
using CrownCommerce.Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Catalog.Infrastructure.Repositories;

public sealed class HairOriginRepository(CatalogDbContext context) : IHairOriginRepository
{
    public async Task<IReadOnlyList<HairOrigin>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Origins
            .AsNoTracking()
            .OrderBy(o => o.Country)
            .ToListAsync(ct);
    }

    public async Task<HairOrigin?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Origins
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, ct);
    }

    public async Task<HairOrigin> AddAsync(HairOrigin origin, CancellationToken ct = default)
    {
        context.Origins.Add(origin);
        await context.SaveChangesAsync(ct);
        return origin;
    }

    public async Task<HairOrigin> UpdateAsync(HairOrigin origin, CancellationToken ct = default)
    {
        context.Origins.Update(origin);
        await context.SaveChangesAsync(ct);
        return origin;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var origin = await context.Origins.FindAsync([id], ct);
        if (origin is not null)
        {
            context.Origins.Remove(origin);
            await context.SaveChangesAsync(ct);
        }
    }
}
