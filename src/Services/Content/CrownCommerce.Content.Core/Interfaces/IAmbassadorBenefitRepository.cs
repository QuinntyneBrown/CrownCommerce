using CrownCommerce.Content.Core.Entities;

namespace CrownCommerce.Content.Core.Interfaces;

public interface IAmbassadorBenefitRepository
{
    Task<IReadOnlyList<AmbassadorBenefit>> GetAllAsync(CancellationToken ct = default);
}
