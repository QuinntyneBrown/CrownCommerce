using System.Text.Json;
using System.Text.RegularExpressions;
using CrownCommerce.Cli.Email.Commands;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Email.Services;

public partial class TemplateStore : ITemplateStore
{
    private readonly ILogger<TemplateStore> _logger;
    private readonly string _templatesPath;

    public TemplateStore(ILogger<TemplateStore> logger, IConfiguration configuration)
    {
        _logger = logger;
        _templatesPath = configuration["Email:TemplatesPath"]
            ?? Path.Combine(AppContext.BaseDirectory, "templates");
    }

    public Task<IReadOnlyList<EmailTemplate>> ListTemplatesAsync()
    {
        var templates = new List<EmailTemplate>();

        if (!Directory.Exists(_templatesPath))
        {
            _logger.LogWarning("Templates directory not found: {Path}", _templatesPath);
            return Task.FromResult<IReadOnlyList<EmailTemplate>>(templates);
        }

        foreach (var file in Directory.GetFiles(_templatesPath, "*.html"))
        {
            var name = Path.GetFileNameWithoutExtension(file);
            var content = File.ReadAllText(file);
            var variables = ExtractVariables(content);
            var service = ExtractService(name);
            templates.Add(new EmailTemplate(name, service, string.Join(", ", variables)));
        }

        return Task.FromResult<IReadOnlyList<EmailTemplate>>(templates);
    }

    public Task<EmailTemplate?> GetTemplateAsync(string name)
    {
        var filePath = Path.Combine(_templatesPath, $"{name}.html");

        if (!File.Exists(filePath))
        {
            _logger.LogWarning("Template not found: {Name}", name);
            return Task.FromResult<EmailTemplate?>(null);
        }

        var content = File.ReadAllText(filePath);
        var variables = ExtractVariables(content);
        var service = ExtractService(name);

        return Task.FromResult<EmailTemplate?>(
            new EmailTemplate(name, service, string.Join(", ", variables)));
    }

    public Task<string> RenderTemplateAsync(string templateName, string? jsonData)
    {
        var filePath = Path.Combine(_templatesPath, $"{templateName}.html");

        if (!File.Exists(filePath))
        {
            _logger.LogWarning("Template not found for rendering: {Name}", templateName);
            return Task.FromResult($"<html><body><p>Template '{templateName}' not found.</p></body></html>");
        }

        var content = File.ReadAllText(filePath);

        if (jsonData is not null)
        {
            try
            {
                var data = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(jsonData);
                if (data is not null)
                {
                    foreach (var kvp in data)
                    {
                        content = content.Replace($"{{{{{kvp.Key}}}}}", kvp.Value.ToString());
                    }
                }
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse template data JSON");
            }
        }

        return Task.FromResult(content);
    }

    private static List<string> ExtractVariables(string content)
    {
        var matches = VariablePattern().Matches(content);
        return matches.Select(m => m.Groups[1].Value).Distinct().ToList();
    }

    private static string ExtractService(string templateName)
    {
        var parts = templateName.Split('-');
        return parts.Length > 1 ? parts[0] : "general";
    }

    [GeneratedRegex(@"\{\{(\w+)\}\}")]
    private static partial Regex VariablePattern();
}
