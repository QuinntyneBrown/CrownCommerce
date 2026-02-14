using CrownCommerce.Scheduling.Core.Entities;
using CrownCommerce.Scheduling.Core.Enums;
using CrownCommerce.Scheduling.Core.Interfaces;
using CrownCommerce.Scheduling.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Scheduling.Infrastructure.Repositories;

public sealed class MeetingRepository(SchedulingDbContext context) : IMeetingRepository
{
    public async Task<Meeting?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Meetings
            .Include(m => m.Attendees)
            .FirstOrDefaultAsync(m => m.Id == id, ct);
    }

    public async Task<IReadOnlyList<Meeting>> GetByDateRangeAsync(DateTime startUtc, DateTime endUtc, CancellationToken ct = default)
    {
        return await context.Meetings
            .AsNoTracking()
            .Include(m => m.Attendees)
            .Where(m => m.StartTimeUtc >= startUtc && m.StartTimeUtc <= endUtc)
            .OrderBy(m => m.StartTimeUtc)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Meeting>> GetByEmployeeAsync(Guid employeeId, DateTime startUtc, DateTime endUtc, CancellationToken ct = default)
    {
        return await context.Meetings
            .AsNoTracking()
            .Include(m => m.Attendees)
            .Where(m => m.StartTimeUtc >= startUtc && m.StartTimeUtc <= endUtc
                && (m.OrganizerId == employeeId || m.Attendees.Any(a => a.EmployeeId == employeeId)))
            .OrderBy(m => m.StartTimeUtc)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Meeting>> GetUpcomingAsync(int count = 10, CancellationToken ct = default)
    {
        return await context.Meetings
            .AsNoTracking()
            .Include(m => m.Attendees)
            .Where(m => m.StartTimeUtc >= DateTime.UtcNow && m.Status == MeetingStatus.Scheduled)
            .OrderBy(m => m.StartTimeUtc)
            .Take(count)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Meeting meeting, CancellationToken ct = default)
    {
        context.Meetings.Add(meeting);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Meeting meeting, CancellationToken ct = default)
    {
        context.Meetings.Update(meeting);
        await context.SaveChangesAsync(ct);
    }
}
