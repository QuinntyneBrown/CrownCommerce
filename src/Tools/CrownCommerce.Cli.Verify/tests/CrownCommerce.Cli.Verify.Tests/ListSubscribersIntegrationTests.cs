using CrownCommerce.Cli.Verify.Services;
using CrownCommerce.Newsletter.Core.Entities;
using CrownCommerce.Newsletter.Core.Enums;
using CrownCommerce.Newsletter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Xunit;

namespace CrownCommerce.Cli.Verify.Tests;

public class ListSubscribersIntegrationTests : IAsyncLifetime
{
    private readonly NewsletterDbContext _db;
    private readonly SubscriberQueryService _service;

    public ListSubscribersIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<NewsletterDbContext>()
            .UseInMemoryDatabase(databaseName: $"Newsletter_Test_{Guid.NewGuid()}")
            .Options;

        _db = new NewsletterDbContext(options);

        var loggerFactory = Microsoft.Extensions.Logging.LoggerFactory.Create(b => { });
        var logger = loggerFactory.CreateLogger<SubscriberQueryService>();

        _service = new SubscriberQueryService(_db, logger);
    }

    public async Task InitializeAsync()
    {
        await _db.Database.EnsureCreatedAsync();

        _db.Subscribers.AddRange(
            new Subscriber
            {
                Id = Guid.NewGuid(),
                Email = "alice@example.com",
                FirstName = "Alice",
                LastName = "Johnson",
                Status = SubscriberStatus.Active,
                CreatedAt = new DateTime(2025, 12, 1, 10, 0, 0, DateTimeKind.Utc),
                Tags = new List<SubscriberTag>
                {
                    new() { Id = Guid.NewGuid(), Tag = "origin-hair-collective-coming-soon", CreatedAt = DateTime.UtcNow },
                },
            },
            new Subscriber
            {
                Id = Guid.NewGuid(),
                Email = "bob@example.com",
                FirstName = "Bob",
                Status = SubscriberStatus.Pending,
                CreatedAt = new DateTime(2025, 12, 5, 14, 30, 0, DateTimeKind.Utc),
                Tags = new List<SubscriberTag>
                {
                    new() { Id = Guid.NewGuid(), Tag = "mane-haus-coming-soon", CreatedAt = DateTime.UtcNow },
                },
            },
            new Subscriber
            {
                Id = Guid.NewGuid(),
                Email = "carol@example.com",
                FirstName = "Carol",
                LastName = "Smith",
                Status = SubscriberStatus.Active,
                CreatedAt = new DateTime(2025, 12, 10, 9, 15, 0, DateTimeKind.Utc),
                Tags = new List<SubscriberTag>
                {
                    new() { Id = Guid.NewGuid(), Tag = "origin-hair-collective-coming-soon", CreatedAt = DateTime.UtcNow },
                    new() { Id = Guid.NewGuid(), Tag = "mane-haus-coming-soon", CreatedAt = DateTime.UtcNow },
                },
            },
            new Subscriber
            {
                Id = Guid.NewGuid(),
                Email = "dave@example.com",
                FirstName = "Dave",
                Status = SubscriberStatus.Active,
                CreatedAt = new DateTime(2025, 11, 20, 8, 0, 0, DateTimeKind.Utc),
                Tags = new List<SubscriberTag>
                {
                    new() { Id = Guid.NewGuid(), Tag = "general-newsletter", CreatedAt = DateTime.UtcNow },
                },
            });

        await _db.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _db.Database.EnsureDeletedAsync();
        await _db.DisposeAsync();
    }

    [Fact]
    public async Task GetComingSoonSubscribers_Returns_Only_ComingSoon_Subscribers()
    {
        // Act
        var result = await _service.GetComingSoonSubscribersAsync();

        // Assert — dave@example.com has no coming-soon tag so should be excluded
        Assert.Equal(3, result.Count);
        Assert.All(result, s => Assert.Contains(s.Tags, t => t.Contains("coming-soon")));
        Assert.DoesNotContain(result, s => s.Email == "dave@example.com");
    }

    [Fact]
    public async Task GetComingSoonSubscribers_Filters_By_Tag()
    {
        // Act
        var result = await _service.GetComingSoonSubscribersAsync("mane-haus-coming-soon");

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, s => Assert.Contains("mane-haus-coming-soon", s.Tags));
    }

    [Fact]
    public async Task GetComingSoonSubscribers_Returns_Ordered_By_CreatedAt_Descending()
    {
        // Act
        var result = await _service.GetComingSoonSubscribersAsync();

        // Assert
        Assert.Equal("carol@example.com", result[0].Email);
        Assert.Equal("bob@example.com", result[1].Email);
        Assert.Equal("alice@example.com", result[2].Email);
    }

    [Fact]
    public async Task GetComingSoonSubscribers_Returns_Empty_When_No_Matches()
    {
        // Act
        var result = await _service.GetComingSoonSubscribersAsync("nonexistent-tag");

        // Assert
        Assert.Empty(result);
    }
}
