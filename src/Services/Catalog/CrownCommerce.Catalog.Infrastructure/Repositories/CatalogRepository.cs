using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Interfaces;
using CrownCommerce.Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Catalog.Infrastructure.Repositories;

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

    public async Task<HairProduct> AddAsync(HairProduct product, CancellationToken ct = default)
    {
        context.Products.Add(product);
        await context.SaveChangesAsync(ct);

        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .FirstAsync(p => p.Id == product.Id, ct);
    }

    public async Task<HairProduct> UpdateAsync(HairProduct product, CancellationToken ct = default)
    {
        context.Products.Update(product);
        await context.SaveChangesAsync(ct);

        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .FirstAsync(p => p.Id == product.Id, ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var product = await context.Products.FindAsync([id], ct);
        if (product is not null)
        {
            context.Products.Remove(product);
            await context.SaveChangesAsync(ct);
        }
    }
}
