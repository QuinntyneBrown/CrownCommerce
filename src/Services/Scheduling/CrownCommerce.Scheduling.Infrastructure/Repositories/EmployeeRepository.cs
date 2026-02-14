using CrownCommerce.Scheduling.Core.Entities;
using CrownCommerce.Scheduling.Core.Enums;
using CrownCommerce.Scheduling.Core.Interfaces;
using CrownCommerce.Scheduling.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Scheduling.Infrastructure.Repositories;

public sealed class EmployeeRepository(SchedulingDbContext context) : IEmployeeRepository
{
    public async Task<Employee?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Employees.FindAsync([id], ct);
    }

    public async Task<Employee?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await context.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.UserId == userId, ct);
    }

    public async Task<IReadOnlyList<Employee>> GetAllAsync(EmployeeStatus? status = null, CancellationToken ct = default)
    {
        var query = context.Employees.AsNoTracking();

        if (status.HasValue)
            query = query.Where(e => e.Status == status.Value);

        return await query.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Employee>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken ct = default)
    {
        var idList = ids.ToList();
        return await context.Employees
            .AsNoTracking()
            .Where(e => idList.Contains(e.Id))
            .ToListAsync(ct);
    }

    public async Task AddAsync(Employee employee, CancellationToken ct = default)
    {
        context.Employees.Add(employee);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Employee employee, CancellationToken ct = default)
    {
        context.Employees.Update(employee);
        await context.SaveChangesAsync(ct);
    }
}
