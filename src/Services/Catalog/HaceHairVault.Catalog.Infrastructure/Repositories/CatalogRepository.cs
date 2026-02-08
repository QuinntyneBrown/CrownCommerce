using HaceHairVault.Catalog.Core.Entities;
using HaceHairVault.Catalog.Core.Interfaces;
using HaceHairVault.Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HaceHairVault.Catalog.Infrastructure.Repositories;

public sealed class CatalogRepository(CatalogDbContext context) : ICatalogRepository
{
    public async Task<IReadOnlyList<HairProduct>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .OrderBy(p => p.Name)
            .ToListAsync(ct);
    }

    public async Task<HairProduct?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<IReadOnlyList<HairProduct>> GetByOriginIdAsync(Guid originId, CancellationToken ct = default)
    {
        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Where(p => p.OriginId == originId)
            .OrderBy(p => p.Name)
            .ToListAsync(ct);
    }
}
