using CrownCommerce.Inquiry.Core.Entities;
using CrownCommerce.Inquiry.Core.Interfaces;
using CrownCommerce.Inquiry.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Inquiry.Infrastructure.Repositories;

public sealed class AmbassadorApplicationRepository(InquiryDbContext context) : IAmbassadorApplicationRepository
{
    public async Task<IReadOnlyList<AmbassadorApplication>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.AmbassadorApplications
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<AmbassadorApplication?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.AmbassadorApplications
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    public async Task<AmbassadorApplication> AddAsync(AmbassadorApplication application, CancellationToken ct = default)
    {
        context.AmbassadorApplications.Add(application);
        await context.SaveChangesAsync(ct);
        return application;
    }
}
