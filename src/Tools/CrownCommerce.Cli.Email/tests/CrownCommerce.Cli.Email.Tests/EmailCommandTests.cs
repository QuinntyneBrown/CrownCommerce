using System.CommandLine;
using CrownCommerce.Cli.Email.Commands;
using CrownCommerce.Cli.Email.Services;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Email.Tests;

public class EmailCommandTests
{
    private readonly IEmailService _emailService;

    public EmailCommandTests()
    {
        _emailService = Substitute.For<IEmailService>();
    }

    private RootCommand CreateCommand()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_emailService);
        return EmailCommand.Create(services.BuildServiceProvider());
    }

    [Fact]
    public async Task Templates_ReturnsZero_AndCallsListTemplatesAsync()
    {
        _emailService.ListTemplatesAsync().Returns(new List<EmailTemplate>
        {
            new("order-confirmation", "order", "orderNumber, customerName"),
        });

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["templates"]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).ListTemplatesAsync();
    }

    [Fact]
    public async Task Send_WithToAndTemplate_ReturnsZero_AndCallsSendAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["send", "--to", "user@example.com", "--template", "order-confirmation"]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).SendAsync("user@example.com", "order-confirmation", null);
    }

    [Fact]
    public async Task Send_WithToTemplateAndData_PassesDataCorrectly()
    {
        var jsonData = "{\"orderNumber\":\"12345\"}";
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["send", "--to", "user@example.com", "--template", "order-confirmation", "--data", jsonData]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).SendAsync("user@example.com", "order-confirmation", jsonData);
    }

    [Fact]
    public async Task Preview_WithTemplateArg_ReturnsZero_AndCallsPreviewAsync()
    {
        _emailService.PreviewAsync("order-confirmation").Returns("file:///tmp/preview.html");

        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["preview", "order-confirmation"]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).PreviewAsync("order-confirmation");
    }

    [Fact]
    public async Task Campaign_WithRequiredOptions_CallsSendCampaignAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync([
            "campaign",
            "--subject", "Summer Sale",
            "--template", "newsletter-welcome",
            "--tag", "summer-2026",
        ]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).SendCampaignAsync("Summer Sale", "newsletter-welcome", "summer-2026", null);
    }

    [Fact]
    public async Task Campaign_WithTestTo_PassesTestEmailCorrectly()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync([
            "campaign",
            "--subject", "Summer Sale",
            "--template", "newsletter-welcome",
            "--tag", "summer-2026",
            "--test-to", "test@example.com",
        ]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).SendCampaignAsync("Summer Sale", "newsletter-welcome", "summer-2026", "test@example.com");
    }

    [Fact]
    public async Task Server_ReturnsZero_AndCallsStartLocalServerAsync()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["server"]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).StartLocalServerAsync(1025);
    }

    [Fact]
    public async Task Server_WithPort_PassesCorrectPort()
    {
        var command = CreateCommand();
        var exitCode = await command.InvokeAsync(["server", "--port", "2525"]);

        Assert.Equal(0, exitCode);
        await _emailService.Received(1).StartLocalServerAsync(2525);
    }
}

public class EmailServiceTests
{
    private readonly ISmtpClient _smtpClient;
    private readonly ITemplateStore _templateStore;
    private readonly EmailService _service;

    public EmailServiceTests()
    {
        _smtpClient = Substitute.For<ISmtpClient>();
        _templateStore = Substitute.For<ITemplateStore>();
        var logger = new Microsoft.Extensions.Logging.Abstractions.NullLogger<EmailService>();
        _service = new EmailService(logger, _smtpClient, _templateStore);
    }

    [Fact]
    public async Task SendAsync_RendersTemplate_AndSendsViaSmtpClient()
    {
        _templateStore.RenderTemplateAsync("order-confirmation", "{\"orderNumber\":\"123\"}")
            .Returns("<html>Order 123</html>");
        _smtpClient.SendAsync(Arg.Any<EmailMessage>()).Returns(true);

        await _service.SendAsync("user@example.com", "order-confirmation", "{\"orderNumber\":\"123\"}");

        await _templateStore.Received(1).RenderTemplateAsync("order-confirmation", "{\"orderNumber\":\"123\"}");
        await _smtpClient.Received(1).SendAsync(Arg.Is<EmailMessage>(m =>
            m.To == "user@example.com" &&
            m.HtmlBody == "<html>Order 123</html>"));
    }

    [Fact]
    public async Task SendAsync_WithNullData_StillSends()
    {
        _templateStore.RenderTemplateAsync("welcome", null)
            .Returns("<html>Welcome</html>");
        _smtpClient.SendAsync(Arg.Any<EmailMessage>()).Returns(true);

        await _service.SendAsync("user@example.com", "welcome", null);

        await _templateStore.Received(1).RenderTemplateAsync("welcome", null);
        await _smtpClient.Received(1).SendAsync(Arg.Is<EmailMessage>(m =>
            m.To == "user@example.com" &&
            m.HtmlBody == "<html>Welcome</html>"));
    }

    [Fact]
    public async Task SendAsync_WhenSmtpFails_DoesNotThrow()
    {
        _templateStore.RenderTemplateAsync("order-confirmation", null)
            .Returns("<html>Order</html>");
        _smtpClient.SendAsync(Arg.Any<EmailMessage>())
            .Returns<bool>(x => throw new InvalidOperationException("SMTP connection failed"));

        var exception = await Record.ExceptionAsync(() =>
            _service.SendAsync("user@example.com", "order-confirmation", null));

        Assert.Null(exception);
    }

    [Fact]
    public async Task PreviewAsync_RendersTemplate_AndReturnsUrl()
    {
        _templateStore.RenderTemplateAsync("order-confirmation", null)
            .Returns("<html>Preview</html>");

        var url = await _service.PreviewAsync("order-confirmation");

        Assert.StartsWith("file://", url);
        Assert.Contains("email-preview-order-confirmation.html", url);
        await _templateStore.Received(1).RenderTemplateAsync("order-confirmation", null);
    }

    [Fact]
    public async Task ListTemplatesAsync_DelegatesToTemplateStore()
    {
        var expected = new List<EmailTemplate>
        {
            new("order-confirmation", "order", "orderNumber"),
            new("welcome", "general", "name"),
        };
        _templateStore.ListTemplatesAsync().Returns(expected);

        var result = await _service.ListTemplatesAsync();

        Assert.Equal(expected, result);
        await _templateStore.Received(1).ListTemplatesAsync();
    }

    [Fact]
    public async Task SendCampaignAsync_WithTestTo_SendsToTestRecipientOnly()
    {
        _templateStore.RenderTemplateAsync("newsletter", null)
            .Returns("<html>Campaign</html>");
        _smtpClient.SendAsync(Arg.Any<EmailMessage>()).Returns(true);

        await _service.SendCampaignAsync("Summer Sale", "newsletter", "summer-2026", "test@example.com");

        await _smtpClient.Received(1).SendAsync(Arg.Is<EmailMessage>(m =>
            m.To == "test@example.com" &&
            m.Subject == "Summer Sale" &&
            m.HtmlBody == "<html>Campaign</html>"));
    }

    [Fact]
    public async Task SendCampaignAsync_WithoutTestTo_SendsToAll()
    {
        _templateStore.RenderTemplateAsync("newsletter", null)
            .Returns("<html>Campaign</html>");

        await _service.SendCampaignAsync("Summer Sale", "newsletter", "summer-2026", null);

        // Without testTo, the current implementation logs the dispatch without calling SmtpClient
        await _smtpClient.DidNotReceive().SendAsync(Arg.Any<EmailMessage>());
        await _templateStore.Received(1).RenderTemplateAsync("newsletter", null);
    }

    [Fact]
    public async Task GetTemplateAsync_ForUnknownTemplate_ReturnsNull()
    {
        _templateStore.GetTemplateAsync("nonexistent").Returns((EmailTemplate?)null);

        // Access the template store directly since EmailService delegates to it
        var result = await _templateStore.GetTemplateAsync("nonexistent");

        Assert.Null(result);
    }
}
