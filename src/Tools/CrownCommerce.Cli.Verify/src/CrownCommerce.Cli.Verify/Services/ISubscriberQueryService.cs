namespace CrownCommerce.Cli.Verify.Services;

public record ComingSoonSubscriber(
    Guid Id,
    string Email,
    string? FirstName,
    string? LastName,
    string Status,
    DateTime CreatedAt,
    List<string> Tags);

public interface ISubscriberQueryService
{
    Task<List<ComingSoonSubscriber>> GetComingSoonSubscribersAsync(string? tag = null);
}
