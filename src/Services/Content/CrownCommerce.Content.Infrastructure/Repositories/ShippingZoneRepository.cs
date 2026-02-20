using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Repositories;

public sealed class ShippingZoneRepository(ContentDbContext context) : IShippingZoneRepository
{
    public async Task<IReadOnlyList<ShippingZone>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.ShippingZones
            .AsNoTracking()
            .OrderBy(z => z.SortOrder)
            .ToListAsync(ct);
    }
}
