using CrownCommerce.Inquiry.Core.Entities;
using CrownCommerce.Inquiry.Core.Interfaces;
using CrownCommerce.Inquiry.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Inquiry.Infrastructure.Repositories;

public sealed class ContactInquiryRepository(InquiryDbContext context) : IContactInquiryRepository
{
    public async Task<IReadOnlyList<ContactInquiry>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.ContactInquiries
            .AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<ContactInquiry> AddAsync(ContactInquiry inquiry, CancellationToken ct = default)
    {
        context.ContactInquiries.Add(inquiry);
        await context.SaveChangesAsync(ct);
        return inquiry;
    }
}
