using CrownCommerce.Inquiry.Core.Entities;

namespace CrownCommerce.Inquiry.Core.Interfaces;

public interface IAmbassadorApplicationRepository
{
    Task<IReadOnlyList<AmbassadorApplication>> GetAllAsync(CancellationToken ct = default);
    Task<AmbassadorApplication?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<AmbassadorApplication> AddAsync(AmbassadorApplication application, CancellationToken ct = default);
}
