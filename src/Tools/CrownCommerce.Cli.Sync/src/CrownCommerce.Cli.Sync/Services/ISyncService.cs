namespace CrownCommerce.Cli.Sync.Services;

public interface ISyncService
{
    Task ShowTeamStatusAsync();
    Task CreateHandoffAsync(string to, string message);
    Task GetInboxAsync();
    Task FindOverlapAsync(string[] members);
    Task StartFocusAsync(string duration, string message);
}
