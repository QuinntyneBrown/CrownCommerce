using CrownCommerce.Inquiry.Core.Entities;
using CrownCommerce.Inquiry.Core.Interfaces;
using CrownCommerce.Inquiry.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Inquiry.Infrastructure.Repositories;

public sealed class WholesaleInquiryRepository(InquiryDbContext context) : IWholesaleInquiryRepository
{
    public async Task<IReadOnlyList<WholesaleInquiry>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.WholesaleInquiries
            .AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<WholesaleInquiry> AddAsync(WholesaleInquiry inquiry, CancellationToken ct = default)
    {
        context.WholesaleInquiries.Add(inquiry);
        await context.SaveChangesAsync(ct);
        return inquiry;
    }
}
