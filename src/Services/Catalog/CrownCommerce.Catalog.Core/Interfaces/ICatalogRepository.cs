using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Enums;

namespace CrownCommerce.Catalog.Core.Interfaces;

public interface ICatalogRepository
{
    Task<IReadOnlyList<HairProduct>> GetAllAsync(CancellationToken ct = default);
    Task<HairProduct?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<HairProduct>> GetByOriginIdAsync(Guid originId, CancellationToken ct = default);
    Task<(IReadOnlyList<HairProduct> Items, int TotalCount)> GetByTypeAsync(HairType type, string? texture, string? size, decimal? minPrice, decimal? maxPrice, string? search, string? sortBy, string? sortDirection, int page, int pageSize, CancellationToken ct = default);
    Task<(IReadOnlyList<HairProduct> Items, int TotalCount)> SearchAsync(HairType? type, string? texture, decimal? minPrice, decimal? maxPrice, string? search, string? sortBy, string? sortDirection, int page, int pageSize, CancellationToken ct = default);
    Task<IReadOnlyList<HairProduct>> GetRelatedAsync(Guid productId, int count = 4, CancellationToken ct = default);
    Task<HairProduct> AddAsync(HairProduct product, CancellationToken ct = default);
    Task<HairProduct> UpdateAsync(HairProduct product, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
