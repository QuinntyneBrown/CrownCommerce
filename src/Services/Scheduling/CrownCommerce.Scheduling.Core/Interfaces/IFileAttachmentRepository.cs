using CrownCommerce.Scheduling.Core.Entities;

namespace CrownCommerce.Scheduling.Core.Interfaces;

public interface IFileAttachmentRepository
{
    Task<FileAttachment?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(FileAttachment attachment, CancellationToken ct = default);
    Task UpdateAsync(FileAttachment attachment, CancellationToken ct = default);
    Task DeleteAsync(FileAttachment attachment, CancellationToken ct = default);
}
