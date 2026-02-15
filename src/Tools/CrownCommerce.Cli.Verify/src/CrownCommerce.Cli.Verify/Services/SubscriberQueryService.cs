using CrownCommerce.Newsletter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Verify.Services;

public sealed class SubscriberQueryService(
    NewsletterDbContext db,
    ILogger<SubscriberQueryService> logger) : ISubscriberQueryService
{
    public async Task<List<ComingSoonSubscriber>> GetComingSoonSubscribersAsync(string? tag = null)
    {
        logger.LogInformation("Querying coming-soon subscribers{Tag}...",
            tag is not null ? $" with tag '{tag}'" : "");

        var query = db.Subscribers
            .Include(s => s.Tags)
            .Where(s => s.Tags.Any(t => t.Tag.Contains("coming-soon")));

        if (tag is not null)
        {
            query = query.Where(s => s.Tags.Any(t => t.Tag == tag));
        }

        var subscribers = await query
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new ComingSoonSubscriber(
                s.Id,
                s.Email,
                s.FirstName,
                s.LastName,
                s.Status.ToString(),
                s.CreatedAt,
                s.Tags.Select(t => t.Tag).ToList()))
            .ToListAsync();

        logger.LogInformation("Found {Count} coming-soon subscribers", subscribers.Count);

        return subscribers;
    }
}
