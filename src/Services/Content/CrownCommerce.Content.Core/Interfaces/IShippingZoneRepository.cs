using CrownCommerce.Content.Core.Entities;

namespace CrownCommerce.Content.Core.Interfaces;

public interface IShippingZoneRepository
{
    Task<IReadOnlyList<ShippingZone>> GetAllAsync(CancellationToken ct = default);
}
