using CrownCommerce.Catalog.Core.Entities;

namespace CrownCommerce.Catalog.Core.Interfaces;

public interface IHairOriginRepository
{
    Task<IReadOnlyList<HairOrigin>> GetAllAsync(CancellationToken ct = default);
    Task<HairOrigin?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<HairOrigin> AddAsync(HairOrigin origin, CancellationToken ct = default);
    Task<HairOrigin> UpdateAsync(HairOrigin origin, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
