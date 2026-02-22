namespace CrownCommerce.Cli.Email.Services;

public record EmailMessage(string To, string Subject, string HtmlBody, string? From = null);

public interface ISmtpClient
{
    Task<bool> SendAsync(EmailMessage message);
}
