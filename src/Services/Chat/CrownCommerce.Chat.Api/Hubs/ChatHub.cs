using System.Text;
using CrownCommerce.Chat.Application.Ai;
using CrownCommerce.Chat.Application.Services;
using CrownCommerce.Chat.Core.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace CrownCommerce.Chat.Api.Hubs;

public sealed class ChatHub(
    IChatService chatService,
    IChatAiService aiService,
    IChatMessageRepository messageRepository) : Hub
{
    public async Task StartConversation(string sessionId, string? visitorName, string initialMessage)
    {
        var dto = new Application.Dtos.CreateConversationDto(sessionId, initialMessage, visitorName);
        var conversation = await chatService.CreateConversationAsync(dto);

        await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation-{conversation.Id}");
        await Clients.Caller.SendAsync("ConversationStarted", new { conversationId = conversation.Id });

        // Stream AI response
        await StreamAiResponseAsync(conversation.Id, initialMessage);
    }

    public async Task SendMessage(Guid conversationId, string sessionId, string content)
    {
        await chatService.AddVisitorMessageAsync(conversationId, sessionId, content);

        // Stream AI response
        await StreamAiResponseAsync(conversationId, content);
    }

    public async Task ResumeConversation(Guid conversationId, string sessionId)
    {
        var conversation = await chatService.GetConversationBySessionAsync(conversationId, sessionId);
        if (conversation is null)
        {
            await Clients.Caller.SendAsync("Error", new { conversationId, message = "Conversation not found or session mismatch." });
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation-{conversationId}");
        await Clients.Caller.SendAsync("ConversationResumed", conversation);
    }

    private async Task StreamAiResponseAsync(Guid conversationId, string visitorMessage)
    {
        var groupName = $"conversation-{conversationId}";
        var fullResponse = new StringBuilder();

        try
        {
            var history = await messageRepository.GetByConversationIdAsync(conversationId, 0, 50);

            await foreach (var chunk in aiService.GenerateResponseAsync(history, visitorMessage))
            {
                fullResponse.Append(chunk);
                await Clients.Group(groupName).SendAsync("ReceiveMessageChunk", new
                {
                    conversationId,
                    chunk,
                    isComplete = false
                });
            }

            // Persist the complete AI response
            var assistantMessage = await chatService.AddAssistantMessageAsync(
                conversationId,
                fullResponse.ToString(),
                tokensUsed: null);

            // Send completion signal with the full message
            await Clients.Group(groupName).SendAsync("ReceiveMessageChunk", new
            {
                conversationId,
                chunk = string.Empty,
                isComplete = true
            });

            await Clients.Group(groupName).SendAsync("ReceiveMessage", assistantMessage);
        }
        catch (Exception)
        {
            await Clients.Group(groupName).SendAsync("Error", new
            {
                conversationId,
                message = "An error occurred while generating a response. Please try again."
            });
        }
    }
}
