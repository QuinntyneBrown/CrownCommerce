using CrownCommerce.Content.Core.Entities;

namespace CrownCommerce.Content.Core.Interfaces;

public interface IWholesaleTierRepository
{
    Task<IReadOnlyList<WholesaleTier>> GetAllAsync(CancellationToken ct = default);
}
