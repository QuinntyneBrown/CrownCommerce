using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Email.Services;

public class SmtpClientWrapper : ISmtpClient
{
    private readonly ILogger<SmtpClientWrapper> _logger;
    private readonly string _host;
    private readonly int _port;
    private readonly string _defaultFrom;

    public SmtpClientWrapper(ILogger<SmtpClientWrapper> logger, IConfiguration configuration)
    {
        _logger = logger;
        _host = configuration["Smtp:Host"] ?? "localhost";
        _port = int.TryParse(configuration["Smtp:Port"], out var port) ? port : 25;
        _defaultFrom = configuration["Smtp:From"] ?? "noreply@crowncommerce.local";
    }

    public async Task<bool> SendAsync(EmailMessage message)
    {
        try
        {
            using var client = new System.Net.Mail.SmtpClient(_host, _port);
            var from = message.From ?? _defaultFrom;
            var mailMessage = new MailMessage(from, message.To, message.Subject, message.HtmlBody)
            {
                IsBodyHtml = true,
            };

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email sent to {To} with subject '{Subject}'", message.To, message.Subject);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", message.To);
            return false;
        }
    }
}
