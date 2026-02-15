using CrownCommerce.Scheduling.Core.Entities;
using CrownCommerce.Scheduling.Core.Interfaces;
using CrownCommerce.Scheduling.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Scheduling.Infrastructure.Repositories;

public sealed class FileAttachmentRepository(SchedulingDbContext context) : IFileAttachmentRepository
{
    public async Task<FileAttachment?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.FileAttachments.FirstOrDefaultAsync(f => f.Id == id, ct);
    }

    public async Task AddAsync(FileAttachment attachment, CancellationToken ct = default)
    {
        context.FileAttachments.Add(attachment);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(FileAttachment attachment, CancellationToken ct = default)
    {
        context.FileAttachments.Update(attachment);
        await context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(FileAttachment attachment, CancellationToken ct = default)
    {
        context.FileAttachments.Remove(attachment);
        await context.SaveChangesAsync(ct);
    }
}
