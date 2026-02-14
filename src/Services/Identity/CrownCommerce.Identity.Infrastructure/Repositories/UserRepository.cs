using CrownCommerce.Identity.Core.Entities;
using CrownCommerce.Identity.Core.Interfaces;
using CrownCommerce.Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Identity.Infrastructure.Repositories;

public sealed class UserRepository(IdentityDbContext context) : IUserRepository
{
    public async Task<AppUser?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    public async Task<AppUser?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task<AppUser> AddAsync(AppUser user, CancellationToken ct = default)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task UpdateAsync(AppUser user, CancellationToken ct = default)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync(ct);
    }
}
