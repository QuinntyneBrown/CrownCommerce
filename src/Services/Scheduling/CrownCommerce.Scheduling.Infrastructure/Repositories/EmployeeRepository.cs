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

    public async Task<IReadOnlyList<Employee>> GetAllAsync(EmployeeStatus? status = null, string? search = null, int skip = 0, int take = 100, CancellationToken ct = default)
    {
        var query = context.Employees.AsNoTracking();

        if (status.HasValue)
            query = query.Where(e => e.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLowerInvariant();
            query = query.Where(e =>
                e.FirstName.ToLower().Contains(s) ||
                e.LastName.ToLower().Contains(s) ||
                e.Email.ToLower().Contains(s) ||
                (e.JobTitle != null && e.JobTitle.ToLower().Contains(s)) ||
                (e.Department != null && e.Department.ToLower().Contains(s)));
        }

        return await query
            .OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
            .Skip(skip).Take(take)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Employee>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken ct = default)
    {
        var idList = ids.ToList();
        return await context.Employees
            .AsNoTracking()
            .Where(e => idList.Contains(e.Id))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Employee>> GetByFullNamesAsync(IEnumerable<string> fullNames, CancellationToken ct = default)
    {
        var nameList = fullNames.Select(n => n.ToLowerInvariant()).ToList();
        var employees = await context.Employees
            .AsNoTracking()
            .ToListAsync(ct);

        return employees
            .Where(e => nameList.Contains($"{e.FirstName} {e.LastName}".ToLowerInvariant()))
            .ToList();
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
