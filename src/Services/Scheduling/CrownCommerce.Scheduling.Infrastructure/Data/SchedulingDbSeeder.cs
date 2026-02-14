using CrownCommerce.Scheduling.Core.Entities;
using CrownCommerce.Scheduling.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Scheduling.Infrastructure.Data;

public static class SchedulingDbSeeder
{
    public static async Task SeedAsync(SchedulingDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Employees.AnyAsync())
            return;

        var employees = new[]
        {
            new Employee
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Email = "quinn@crowncommerce.com",
                FirstName = "Quinn",
                LastName = "Morgan",
                Phone = "+1-555-0101",
                JobTitle = "Operations Manager",
                Department = "Operations",
                TimeZone = "America/New_York",
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Email = "amara@crowncommerce.com",
                FirstName = "Amara",
                LastName = "Okafor",
                Phone = "+254-700-123456",
                JobTitle = "Supply Chain Lead",
                Department = "Supply Chain",
                TimeZone = "Africa/Nairobi",
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Email = "wanjiku@crowncommerce.com",
                FirstName = "Wanjiku",
                LastName = "Kamau",
                Phone = "+254-700-654321",
                JobTitle = "Quality Assurance Specialist",
                Department = "Quality",
                TimeZone = "Africa/Nairobi",
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Email = "sophia@crowncommerce.com",
                FirstName = "Sophia",
                LastName = "Chen",
                Phone = "+1-555-0104",
                JobTitle = "Marketing Director",
                Department = "Marketing",
                TimeZone = "America/Los_Angeles",
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
            },
            new Employee
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Email = "james@crowncommerce.com",
                FirstName = "James",
                LastName = "Mwangi",
                Phone = "+254-700-789012",
                JobTitle = "Warehouse Manager",
                Department = "Logistics",
                TimeZone = "Africa/Nairobi",
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
            },
        };

        context.Employees.AddRange(employees);
        await context.SaveChangesAsync();
    }
}
