using CrownCommerce.Catalog.Core.Entities;

namespace CrownCommerce.Catalog.Core.Interfaces;

public interface IProductReviewRepository
{
    Task<IReadOnlyList<ProductReview>> GetByProductIdAsync(Guid productId, int page, int pageSize, CancellationToken ct = default);
    Task<int> GetCountByProductIdAsync(Guid productId, CancellationToken ct = default);
    Task<ProductReview> AddAsync(ProductReview review, CancellationToken ct = default);
}
