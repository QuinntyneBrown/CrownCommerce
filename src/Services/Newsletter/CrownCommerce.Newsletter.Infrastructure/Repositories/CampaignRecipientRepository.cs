using CrownCommerce.Newsletter.Core.Entities;
using CrownCommerce.Newsletter.Core.Enums;
using CrownCommerce.Newsletter.Core.Interfaces;
using CrownCommerce.Newsletter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Newsletter.Infrastructure.Repositories;

public sealed class CampaignRecipientRepository(NewsletterDbContext context) : ICampaignRecipientRepository
{
    public async Task AddBatchAsync(IReadOnlyList<CampaignRecipient> recipients, CancellationToken ct = default)
    {
        context.CampaignRecipients.AddRange(recipients);
        await context.SaveChangesAsync(ct);
    }

    public async Task<(IReadOnlyList<CampaignRecipient> Items, int TotalCount)> GetPagedByCampaignAsync(
        Guid campaignId, int page, int pageSize, DeliveryStatus? status, CancellationToken ct = default)
    {
        var query = context.CampaignRecipients
            .Where(r => r.CampaignId == campaignId);

        if (status.HasValue)
            query = query.Where(r => r.Status == status.Value);

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .OrderBy(r => r.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<IReadOnlyList<CampaignRecipient>> GetQueuedByCampaignAsync(
        Guid campaignId, int batchSize, CancellationToken ct = default)
    {
        return await context.CampaignRecipients
            .Where(r => r.CampaignId == campaignId && r.Status == DeliveryStatus.Queued)
            .Take(batchSize)
            .ToListAsync(ct);
    }

    public async Task UpdateAsync(CampaignRecipient recipient, CancellationToken ct = default)
    {
        context.CampaignRecipients.Update(recipient);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateBatchAsync(IReadOnlyList<CampaignRecipient> recipients, CancellationToken ct = default)
    {
        context.CampaignRecipients.UpdateRange(recipients);
        await context.SaveChangesAsync(ct);
    }
}
