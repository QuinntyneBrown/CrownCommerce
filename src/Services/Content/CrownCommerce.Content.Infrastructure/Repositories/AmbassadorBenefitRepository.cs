using CrownCommerce.Content.Core.Entities;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Repositories;

public sealed class AmbassadorBenefitRepository(ContentDbContext context) : IAmbassadorBenefitRepository
{
    public async Task<IReadOnlyList<AmbassadorBenefit>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.AmbassadorBenefits
            .AsNoTracking()
            .OrderBy(b => b.SortOrder)
            .ToListAsync(ct);
    }
}
