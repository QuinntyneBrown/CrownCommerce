using CrownCommerce.Content.Core.Entities;

namespace CrownCommerce.Content.Core.Interfaces;

public interface IHairCareSectionRepository
{
    Task<IReadOnlyList<HairCareSection>> GetAllAsync(CancellationToken ct = default);
}
