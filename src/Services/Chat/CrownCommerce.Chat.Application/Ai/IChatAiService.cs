using CrownCommerce.Chat.Core.Entities;

namespace CrownCommerce.Chat.Application.Ai;

public interface IChatAiService
{
    IAsyncEnumerable<string> GenerateResponseAsync(
        IReadOnlyList<ChatMessage> conversationHistory,
        string visitorMessage,
        CancellationToken ct = default);
}
