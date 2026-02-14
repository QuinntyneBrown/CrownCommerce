using CrownCommerce.Newsletter.Core.Enums;

namespace CrownCommerce.Newsletter.Core.Interfaces;

public interface ICampaignRecipientRepository
{
    Task AddBatchAsync(IReadOnlyList<Entities.CampaignRecipient> recipients, CancellationToken ct = default);
    Task<(IReadOnlyList<Entities.CampaignRecipient> Items, int TotalCount)> GetPagedByCampaignAsync(
        Guid campaignId, int page, int pageSize, DeliveryStatus? status, CancellationToken ct = default);
    Task<IReadOnlyList<Entities.CampaignRecipient>> GetQueuedByCampaignAsync(
        Guid campaignId, int batchSize, CancellationToken ct = default);
    Task UpdateAsync(Entities.CampaignRecipient recipient, CancellationToken ct = default);
    Task UpdateBatchAsync(IReadOnlyList<Entities.CampaignRecipient> recipients, CancellationToken ct = default);
}
