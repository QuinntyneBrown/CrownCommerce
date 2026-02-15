using CrownCommerce.Cli.Email.Commands;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Email.Services;

public class EmailService : IEmailService
{
    private static readonly List<EmailTemplate> Templates =
    [
        new("order-confirmation", "order", "orderNumber, customerName, items, total"),
        new("payment-receipt", "order", "orderNumber, amount, paymentMethod, date"),
        new("order-status-update", "order", "orderNumber, status, trackingNumber"),
        new("refund-notification", "order", "orderNumber, refundAmount, reason"),
        new("inquiry-confirmation", "crm", "inquiryId, customerName, subject"),
        new("newsletter-welcome", "newsletter", "subscriberName, preferencesUrl"),
        new("campaign-completed", "newsletter", "campaignName, sentCount, openRate"),
    ];

    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger) => _logger = logger;

    public Task SendAsync(string to, string template, string? data)
    {
        _logger.LogInformation("Sending email to {To} using template '{Template}' with data: {Data}",
            to, template, data ?? "(none)");
        return Task.CompletedTask;
    }

    public Task<string> PreviewAsync(string template)
    {
        _logger.LogInformation("Opening browser preview for template '{Template}'", template);
        return Task.FromResult($"http://localhost:3000/preview/{template}");
    }

    public Task<IReadOnlyList<EmailTemplate>> ListTemplatesAsync()
    {
        return Task.FromResult<IReadOnlyList<EmailTemplate>>(Templates);
    }

    public Task SendCampaignAsync(string subject, string template, string tag, string? testTo)
    {
        if (testTo is not null)
        {
            _logger.LogInformation(
                "Sending test campaign '{Subject}' using template '{Template}' tagged '{Tag}' to {TestTo}",
                subject, template, tag, testTo);
        }
        else
        {
            _logger.LogInformation(
                "Sending campaign '{Subject}' using template '{Template}' tagged '{Tag}' to all subscribers",
                subject, template, tag);
        }

        return Task.CompletedTask;
    }

    public Task StartLocalServerAsync(int port)
    {
        _logger.LogInformation("Starting local SMTP trap on port {Port}", port);
        return Task.CompletedTask;
    }
}
