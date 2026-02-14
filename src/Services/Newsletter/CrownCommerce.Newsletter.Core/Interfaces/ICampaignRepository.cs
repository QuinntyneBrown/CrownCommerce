using CrownCommerce.Newsletter.Core.Enums;

namespace CrownCommerce.Newsletter.Core.Interfaces;

public interface ICampaignRepository
{
    Task<Entities.Campaign?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<(IReadOnlyList<Entities.Campaign> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, CampaignStatus? status, CancellationToken ct = default);
    Task<IReadOnlyList<Entities.Campaign>> GetScheduledDueAsync(DateTime asOf, CancellationToken ct = default);
    Task AddAsync(Entities.Campaign campaign, CancellationToken ct = default);
    Task UpdateAsync(Entities.Campaign campaign, CancellationToken ct = default);
}
