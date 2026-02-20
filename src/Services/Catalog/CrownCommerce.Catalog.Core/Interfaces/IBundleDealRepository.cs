using CrownCommerce.Catalog.Core.Entities;

namespace CrownCommerce.Catalog.Core.Interfaces;

public interface IBundleDealRepository
{
    Task<IReadOnlyList<BundleDeal>> GetAllAsync(CancellationToken ct = default);
    Task<BundleDeal?> GetByIdAsync(Guid id, CancellationToken ct = default);
}
