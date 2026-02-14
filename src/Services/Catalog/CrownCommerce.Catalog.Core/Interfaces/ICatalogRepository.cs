using CrownCommerce.Catalog.Core.Entities;

namespace CrownCommerce.Catalog.Core.Interfaces;

public interface ICatalogRepository
{
    Task<IReadOnlyList<HairProduct>> GetAllAsync(CancellationToken ct = default);
    Task<HairProduct?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<HairProduct>> GetByOriginIdAsync(Guid originId, CancellationToken ct = default);
}
