using OriginHairCollective.Chat.Core.Entities;

namespace OriginHairCollective.Chat.Application.Ai;

public interface IChatAiService
{
    IAsyncEnumerable<string> GenerateResponseAsync(
        IReadOnlyList<ChatMessage> conversationHistory,
        string visitorMessage,
        CancellationToken ct = default);
}
