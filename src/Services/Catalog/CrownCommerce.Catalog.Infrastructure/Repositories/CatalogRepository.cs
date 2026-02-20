using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Enums;
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
            .Include(p => p.Images)
            .OrderBy(p => p.Name)
            .ToListAsync(ct);
    }

    public async Task<HairProduct?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<IReadOnlyList<HairProduct>> GetByOriginIdAsync(Guid originId, CancellationToken ct = default)
    {
        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
            .Where(p => p.OriginId == originId)
            .OrderBy(p => p.Name)
            .ToListAsync(ct);
    }

    public async Task<(IReadOnlyList<HairProduct> Items, int TotalCount)> GetByTypeAsync(
        HairType type, string? texture, string? size, decimal? minPrice, decimal? maxPrice,
        string? search, string? sortBy, string? sortDirection, int page, int pageSize, CancellationToken ct = default)
    {
        var query = context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
            .Where(p => p.Type == type);

        query = ApplyFilters(query, texture, minPrice, maxPrice, search);
        var totalCount = await query.CountAsync(ct);
        query = ApplySorting(query, sortBy, sortDirection);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<(IReadOnlyList<HairProduct> Items, int TotalCount)> SearchAsync(
        HairType? type, string? texture, decimal? minPrice, decimal? maxPrice,
        string? search, string? sortBy, string? sortDirection, int page, int pageSize, CancellationToken ct = default)
    {
        var query = context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
            .AsQueryable();

        if (type.HasValue)
            query = query.Where(p => p.Type == type.Value);

        query = ApplyFilters(query, texture, minPrice, maxPrice, search);
        var totalCount = await query.CountAsync(ct);
        query = ApplySorting(query, sortBy, sortDirection);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<IReadOnlyList<HairProduct>> GetRelatedAsync(Guid productId, int count = 4, CancellationToken ct = default)
    {
        var product = await context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == productId, ct);
        if (product is null) return [];

        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
            .Where(p => p.Id != productId && (p.Type == product.Type || p.Texture == product.Texture))
            .OrderByDescending(p => p.Rating)
            .Take(count)
            .ToListAsync(ct);
    }

    public async Task<HairProduct> AddAsync(HairProduct product, CancellationToken ct = default)
    {
        context.Products.Add(product);
        await context.SaveChangesAsync(ct);

        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
            .FirstAsync(p => p.Id == product.Id, ct);
    }

    public async Task<HairProduct> UpdateAsync(HairProduct product, CancellationToken ct = default)
    {
        context.Products.Update(product);
        await context.SaveChangesAsync(ct);

        return await context.Products
            .AsNoTracking()
            .Include(p => p.Origin)
            .Include(p => p.Images)
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

    private static IQueryable<HairProduct> ApplyFilters(
        IQueryable<HairProduct> query, string? texture, decimal? minPrice, decimal? maxPrice, string? search)
    {
        if (!string.IsNullOrWhiteSpace(texture) && Enum.TryParse<HairTexture>(texture, ignoreCase: true, out var tex))
            query = query.Where(p => p.Texture == tex);

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

        return query;
    }

    private static IQueryable<HairProduct> ApplySorting(IQueryable<HairProduct> query, string? sortBy, string? sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return sortBy?.ToLowerInvariant() switch
        {
            "price" => descending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "rating" => descending ? query.OrderByDescending(p => p.Rating) : query.OrderBy(p => p.Rating),
            "newest" => descending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
            _ => descending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name)
        };
    }
}
