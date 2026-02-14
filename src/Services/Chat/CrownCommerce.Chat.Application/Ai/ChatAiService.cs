using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CrownCommerce.Chat.Core.Entities;
using CrownCommerce.Chat.Core.Enums;

namespace CrownCommerce.Chat.Application.Ai;

public sealed class ChatAiService(
    IHttpClientFactory httpClientFactory,
    SystemPromptBuilder systemPromptBuilder,
    IConfiguration configuration,
    ILogger<ChatAiService> logger) : IChatAiService
{
    public async IAsyncEnumerable<string> GenerateResponseAsync(
        IReadOnlyList<ChatMessage> conversationHistory,
        string visitorMessage,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        var client = httpClientFactory.CreateClient("LlmProvider");
        var model = configuration["Ai:Model"] ?? "claude-sonnet-4-5-20250929";
        var maxTokens = int.TryParse(configuration["Ai:MaxTokens"], out var mt) ? mt : 1024;

        var messages = new List<object>();

        // Include last 20 messages of conversation history
        var recentHistory = conversationHistory
            .OrderBy(m => m.SentAt)
            .TakeLast(20)
            .ToList();

        foreach (var msg in recentHistory)
        {
            messages.Add(new
            {
                role = msg.SenderType == MessageSender.Visitor ? "user" : "assistant",
                content = msg.Content
            });
        }

        // Add the current visitor message
        messages.Add(new { role = "user", content = visitorMessage });

        var requestBody = new
        {
            model,
            max_tokens = maxTokens,
            system = systemPromptBuilder.Build(),
            messages,
            stream = true
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "/v1/messages")
        {
            Content = JsonContent.Create(requestBody)
        };

        HttpResponseMessage? response = null;
        string? errorMessage = null;

        try
        {
            response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to call LLM API");
            errorMessage = "I'm sorry, I'm having trouble generating a response right now. Please try again in a moment.";
        }

        if (errorMessage is not null)
        {
            yield return errorMessage;
            yield break;
        }

        await using var stream = await response!.Content.ReadAsStreamAsync(ct);
        using var reader = new StreamReader(stream, Encoding.UTF8);

        while (!reader.EndOfStream)
        {
            ct.ThrowIfCancellationRequested();

            var line = await reader.ReadLineAsync(ct);
            if (string.IsNullOrEmpty(line)) continue;
            if (!line.StartsWith("data: ")) continue;

            var data = line["data: ".Length..];
            if (data == "[DONE]") break;

            string? text = null;

            using var doc = JsonDocument.Parse(data);
            var root = doc.RootElement;

            if (root.TryGetProperty("type", out var typeProp))
            {
                var eventType = typeProp.GetString();
                if (eventType == "content_block_delta" &&
                    root.TryGetProperty("delta", out var delta) &&
                    delta.TryGetProperty("text", out var textProp))
                {
                    text = textProp.GetString();
                }
            }

            if (text is not null)
            {
                yield return text;
            }
        }
    }
}
