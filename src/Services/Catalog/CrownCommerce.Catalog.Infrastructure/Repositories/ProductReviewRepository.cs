using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Interfaces;
using CrownCommerce.Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Catalog.Infrastructure.Repositories;

public sealed class ProductReviewRepository(CatalogDbContext context) : IProductReviewRepository
{
    public async Task<IReadOnlyList<ProductReview>> GetByProductIdAsync(Guid productId, int page, int pageSize, CancellationToken ct = default)
    {
        return await context.ProductReviews
            .AsNoTracking()
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task<int> GetCountByProductIdAsync(Guid productId, CancellationToken ct = default)
    {
        return await context.ProductReviews
            .AsNoTracking()
            .CountAsync(r => r.ProductId == productId, ct);
    }

    public async Task<ProductReview> AddAsync(ProductReview review, CancellationToken ct = default)
    {
        context.ProductReviews.Add(review);
        await context.SaveChangesAsync(ct);
        return review;
    }
}
