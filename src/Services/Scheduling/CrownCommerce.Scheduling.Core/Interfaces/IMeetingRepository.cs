using CrownCommerce.Scheduling.Core.Entities;

namespace CrownCommerce.Scheduling.Core.Interfaces;

public interface IMeetingRepository
{
    Task<Meeting?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Meeting>> GetByDateRangeAsync(DateTime startUtc, DateTime endUtc, CancellationToken ct = default);
    Task<IReadOnlyList<Meeting>> GetByEmployeeAsync(Guid employeeId, DateTime startUtc, DateTime endUtc, CancellationToken ct = default);
    Task<IReadOnlyList<Meeting>> GetUpcomingAsync(int count = 10, CancellationToken ct = default);
    Task AddAsync(Meeting meeting, CancellationToken ct = default);
    Task UpdateAsync(Meeting meeting, CancellationToken ct = default);
}
