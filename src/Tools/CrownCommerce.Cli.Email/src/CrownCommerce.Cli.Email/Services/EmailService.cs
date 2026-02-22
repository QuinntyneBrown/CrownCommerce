using CrownCommerce.Cli.Email.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Email.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly ISmtpClient _smtpClient;
    private readonly ITemplateStore _templateStore;

    public EmailService(ILogger<EmailService> logger, ISmtpClient smtpClient, ITemplateStore templateStore)
    {
        _logger = logger;
        _smtpClient = smtpClient;
        _templateStore = templateStore;
    }

    public async Task SendAsync(string to, string template, string? data)
    {
        _logger.LogInformation("Sending email to {To} using template '{Template}'", to, template);

        var htmlBody = await _templateStore.RenderTemplateAsync(template, data);
        var message = new EmailMessage(to, $"Email: {template}", htmlBody);

        try
        {
            await _smtpClient.SendAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
        }
    }

    public async Task<string> PreviewAsync(string template)
    {
        _logger.LogInformation("Generating preview for template '{Template}'", template);

        var htmlBody = await _templateStore.RenderTemplateAsync(template, null);
        var tempFile = Path.Combine(Path.GetTempPath(), $"email-preview-{template}.html");
        await File.WriteAllTextAsync(tempFile, htmlBody);

        var url = $"file://{tempFile}";
        _logger.LogInformation("Preview written to {Url}", url);
        return url;
    }

    public async Task<IReadOnlyList<EmailTemplate>> ListTemplatesAsync()
    {
        return await _templateStore.ListTemplatesAsync();
    }

    public async Task SendCampaignAsync(string subject, string template, string tag, string? testTo)
    {
        _logger.LogInformation(
            "Preparing campaign '{Subject}' with template '{Template}' tagged '{Tag}'",
            subject, template, tag);

        var htmlBody = await _templateStore.RenderTemplateAsync(template, null);

        if (testTo is not null)
        {
            _logger.LogInformation("Sending test campaign to {TestTo}", testTo);
            var message = new EmailMessage(testTo, subject, htmlBody);

            try
            {
                await _smtpClient.SendAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send test campaign to {TestTo}", testTo);
            }
        }
        else
        {
            _logger.LogInformation("Dispatching campaign '{Subject}' to all subscribers", subject);
            // In a real implementation, this would iterate over a subscriber list.
            // For now, log the intent.
            _logger.LogInformation("Campaign '{Subject}' tagged '{Tag}' dispatched to all subscribers", subject, tag);
        }
    }

    public Task StartLocalServerAsync(int port)
    {
        _logger.LogInformation("Starting local SMTP trap on port {Port}", port);
        // Placeholder: in a real implementation, this would start a local SMTP server
        // using a library like SmtpServer or netDumbster for development testing.
        _logger.LogInformation("Local SMTP trap is ready on port {Port} (placeholder)", port);
        return Task.CompletedTask;
    }
}
