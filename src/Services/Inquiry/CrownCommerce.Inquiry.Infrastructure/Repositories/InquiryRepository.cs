using CrownCommerce.Inquiry.Core.Interfaces;
using CrownCommerce.Inquiry.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Inquiry.Infrastructure.Repositories;

public sealed class InquiryRepository(InquiryDbContext context) : IInquiryRepository
{
    public async Task<IReadOnlyList<Core.Entities.Inquiry>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Inquiries
            .AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<Core.Entities.Inquiry> AddAsync(Core.Entities.Inquiry inquiry, CancellationToken ct = default)
    {
        context.Inquiries.Add(inquiry);
        await context.SaveChangesAsync(ct);
        return inquiry;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var inquiry = await context.Inquiries.FindAsync([id], ct);
        if (inquiry is not null)
        {
            context.Inquiries.Remove(inquiry);
            await context.SaveChangesAsync(ct);
        }
    }
}
