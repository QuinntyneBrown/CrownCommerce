using System.Security.Cryptography;
using CrownCommerce.Identity.Core.Entities;
using CrownCommerce.Identity.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Identity.Infrastructure.Data;

public static class IdentityDbSeeder
{
    // These UserIds must match the deterministic UserIds in SchedulingDbSeeder.
    // All seeded users share the password: Password123!
    public static async Task SeedAsync(IdentityDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Users.AnyAsync())
            return;

        var users = new[]
        {
            new AppUser
            {
                Id = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                Email = "quinn@crowncommerce.com",
                PasswordHash = HashPassword("Password123!"),
                FirstName = "Quinn",
                LastName = "Morgan",
                Phone = "+1-555-0101",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            },
            new AppUser
            {
                Id = new Guid("b2c3d4e5-f6a7-8901-bcde-f12345678901"),
                Email = "amara@crowncommerce.com",
                PasswordHash = HashPassword("Password123!"),
                FirstName = "Amara",
                LastName = "Okafor",
                Phone = "+254-700-123456",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            },
            new AppUser
            {
                Id = new Guid("c3d4e5f6-a7b8-9012-cdef-123456789012"),
                Email = "wanjiku@crowncommerce.com",
                PasswordHash = HashPassword("Password123!"),
                FirstName = "Wanjiku",
                LastName = "Kamau",
                Phone = "+254-700-654321",
                Role = UserRole.Customer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            },
            new AppUser
            {
                Id = new Guid("d4e5f6a7-b8c9-0123-defa-234567890123"),
                Email = "sophia@crowncommerce.com",
                PasswordHash = HashPassword("Password123!"),
                FirstName = "Sophia",
                LastName = "Chen",
                Phone = "+1-555-0104",
                Role = UserRole.Customer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            },
            new AppUser
            {
                Id = new Guid("e5f6a7b8-c9d0-1234-efab-345678901234"),
                Email = "james@crowncommerce.com",
                PasswordHash = HashPassword("Password123!"),
                FirstName = "James",
                LastName = "Mwangi",
                Phone = "+254-700-789012",
                Role = UserRole.Customer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            },
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();
    }

    private static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);
        var combined = new byte[48];
        salt.CopyTo(combined, 0);
        hash.CopyTo(combined, 16);
        return Convert.ToBase64String(combined);
    }
}
