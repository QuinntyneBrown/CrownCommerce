using CrownCommerce.Cli.Email.Commands;

namespace CrownCommerce.Cli.Email.Services;

public interface IEmailService
{
    Task SendAsync(string to, string template, string? data);
    Task<string> PreviewAsync(string template);
    Task<IReadOnlyList<EmailTemplate>> ListTemplatesAsync();
    Task SendCampaignAsync(string subject, string template, string tag, string? testTo);
    Task StartLocalServerAsync(int port);
}
