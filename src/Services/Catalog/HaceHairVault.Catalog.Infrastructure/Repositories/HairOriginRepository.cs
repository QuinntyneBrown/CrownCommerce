using HaceHairVault.Catalog.Core.Entities;
using HaceHairVault.Catalog.Core.Interfaces;
using HaceHairVault.Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HaceHairVault.Catalog.Infrastructure.Repositories;

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
}
