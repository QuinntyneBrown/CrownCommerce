using CrownCommerce.Cli.Email.Commands;

namespace CrownCommerce.Cli.Email.Services;

public interface ITemplateStore
{
    Task<IReadOnlyList<EmailTemplate>> ListTemplatesAsync();
    Task<EmailTemplate?> GetTemplateAsync(string name);
    Task<string> RenderTemplateAsync(string templateName, string? jsonData);
}
