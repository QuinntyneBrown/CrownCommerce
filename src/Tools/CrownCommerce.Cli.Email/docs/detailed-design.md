# CrownCommerce.Cli.Email - Detailed Design

## Purpose

`cc-email` is a .NET 9 CLI tool for managing email campaigns and sending transactional emails. It provides commands for sending individual emails, previewing templates, listing available templates, dispatching campaigns, and running a local SMTP trap for development.

## Architecture

```
Commands (System.CommandLine)
    |
    v
IEmailService (orchestration)
    |
    +---> ISmtpClient   (sending emails via SMTP)
    +---> ITemplateStore (loading and rendering templates)
```

All dependencies are registered through `Microsoft.Extensions.DependencyInjection` and resolved via `IServiceProvider`. The CLI uses `Microsoft.Extensions.Hosting` for configuration and logging infrastructure.

## Commands

| Command     | Description                              | Options / Arguments                                      |
|-------------|------------------------------------------|----------------------------------------------------------|
| `send`      | Send a transactional email               | `--to` (required), `--template` (required), `--data`     |
| `preview`   | Preview a template in the browser        | `<template>` (argument, required)                        |
| `templates` | List all available email templates       | (none)                                                   |
| `campaign`  | Send a campaign email to subscribers     | `--subject`, `--template`, `--tag` (all required), `--test-to` |
| `server`    | Start a local SMTP trap for testing      | `--port` (default: 1025)                                 |

## Abstractions

### ISmtpClient

Responsible for the physical delivery of email messages over SMTP.

```csharp
public record EmailMessage(string To, string Subject, string HtmlBody, string? From = null);

public interface ISmtpClient
{
    Task<bool> SendAsync(EmailMessage message);
}
```

The default implementation (`SmtpClientWrapper`) uses `System.Net.Mail.SmtpClient` configured through `IConfiguration` with keys:
- `Smtp:Host` (default: `localhost`)
- `Smtp:Port` (default: `25`)
- `Smtp:From` (default: `noreply@crowncommerce.local`)

### ITemplateStore

Responsible for loading, listing, and rendering email templates.

```csharp
public interface ITemplateStore
{
    Task<IReadOnlyList<EmailTemplate>> ListTemplatesAsync();
    Task<EmailTemplate?> GetTemplateAsync(string name);
    Task<string> RenderTemplateAsync(string templateName, string? jsonData);
}
```

The default implementation (`TemplateStore`) reads HTML files from a configurable templates directory (`Email:TemplatesPath`). Templates use `{{variable}}` placeholder syntax for data substitution.

## Data Models

### EmailTemplate

```csharp
public record EmailTemplate(string Name, string Service, string Variables);
```

Represents metadata about an available email template including its name, the service it belongs to, and its expected variables.

### EmailMessage

```csharp
public record EmailMessage(string To, string Subject, string HtmlBody, string? From = null);
```

Represents a fully rendered email ready for delivery.

### CampaignResult

Campaign results are reported via logging. The `SendCampaignAsync` method tracks:
- Number of recipients targeted
- Whether it was a test send or full dispatch
- The campaign tag for tracking purposes

## Error Handling

- **SMTP failures**: `SendAsync` catches exceptions from `ISmtpClient` and logs them without propagating. The CLI reports success/failure via exit codes and console output.
- **Template not found**: When a template name does not match any file in the templates directory, the service logs a warning and returns gracefully.
- **Invalid JSON data**: Malformed `--data` JSON is caught and reported to the user with a descriptive error message.

## Retry Strategy

The current implementation does not include automatic retries. SMTP failures are logged and reported. Future enhancements may add:
- Configurable retry count via `Email:RetryCount`
- Exponential backoff between attempts
- Dead-letter logging for failed campaign sends

## Testing Strategy

### Unit Tests

- **Mock `ISmtpClient`**: Verify that `EmailService` correctly renders templates and passes the right `EmailMessage` to the SMTP client.
- **Mock `ITemplateStore`**: Verify that `EmailService` correctly delegates template operations and handles missing templates.
- **Mock `IEmailService`**: Verify that CLI commands parse arguments correctly and invoke the right service methods.

### Test Classes

- `EmailCommandTests`: Tests each CLI command by mocking `IEmailService` and verifying correct argument parsing and service invocation.
- `EmailServiceTests`: Tests `EmailService` logic by mocking `ISmtpClient` and `ITemplateStore`, verifying orchestration behavior for send, preview, campaign, and server operations.

### Tools

- **xUnit** for test framework
- **NSubstitute** for mocking interfaces
- **Microsoft.Extensions.Logging.Abstractions** for `NullLogger` in service tests
