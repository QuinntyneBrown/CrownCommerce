using CrownCommerce.Chat.Application.Dtos;
using CrownCommerce.Chat.Application.Mapping;
using CrownCommerce.Chat.Core.Entities;
using CrownCommerce.Chat.Core.Enums;
using CrownCommerce.Chat.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;

namespace CrownCommerce.Chat.Application.Services;

public sealed class ChatService(
    IConversationRepository conversationRepository,
    IChatMessageRepository messageRepository,
    IPublishEndpoint publishEndpoint) : IChatService
{
    public async Task<ConversationDto> CreateConversationAsync(CreateConversationDto dto, CancellationToken ct = default)
    {
        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            SessionId = dto.SessionId,
            VisitorName = dto.VisitorName,
            Status = ConversationStatus.Active,
            CreatedAt = DateTime.UtcNow,
            MessageCount = 0
        };

        await conversationRepository.AddAsync(conversation, ct);

        await publishEndpoint.Publish(new ChatConversationStartedEvent(
            conversation.Id,
            conversation.VisitorName,
            dto.InitialMessage,
            DateTime.UtcNow), ct);

        // Add the initial visitor message
        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            SenderType = MessageSender.Visitor,
            Content = dto.InitialMessage,
            SentAt = DateTime.UtcNow
        };

        await messageRepository.AddAsync(message, ct);

        conversation.MessageCount = 1;
        conversation.LastMessageAt = message.SentAt;
        await conversationRepository.UpdateAsync(conversation, ct);

        await publishEndpoint.Publish(new ChatMessageSentEvent(
            message.Id,
            conversation.Id,
            MessageSender.Visitor.ToString(),
            DateTime.UtcNow), ct);

        conversation.Messages = [message];
        return conversation.ToDto();
    }

    public async Task<ConversationDto?> GetConversationAsync(Guid id, CancellationToken ct = default)
    {
        var conversation = await conversationRepository.GetByIdWithMessagesAsync(id, ct);
        return conversation?.ToDto();
    }

    public async Task<ConversationDto?> GetConversationBySessionAsync(Guid id, string sessionId, CancellationToken ct = default)
    {
        var conversation = await conversationRepository.GetByIdWithMessagesAsync(id, ct);
        if (conversation is null || conversation.SessionId != sessionId)
            return null;
        return conversation.ToDto();
    }

    public async Task<IReadOnlyList<ConversationSummaryDto>> GetAllConversationsAsync(int skip = 0, int take = 50, CancellationToken ct = default)
    {
        var conversations = await conversationRepository.GetAllAsync(skip, take, ct);
        return conversations.Select(c => c.ToSummaryDto()).ToList();
    }

    public async Task<ChatMessageDto> AddVisitorMessageAsync(Guid conversationId, string sessionId, string content, CancellationToken ct = default)
    {
        var conversation = await conversationRepository.GetByIdAsync(conversationId, ct)
            ?? throw new InvalidOperationException("Conversation not found.");

        if (conversation.SessionId != sessionId)
            throw new UnauthorizedAccessException("Session ID does not match conversation.");

        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderType = MessageSender.Visitor,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        await messageRepository.AddAsync(message, ct);

        conversation.MessageCount++;
        conversation.LastMessageAt = message.SentAt;
        await conversationRepository.UpdateAsync(conversation, ct);

        await publishEndpoint.Publish(new ChatMessageSentEvent(
            message.Id,
            conversationId,
            MessageSender.Visitor.ToString(),
            DateTime.UtcNow), ct);

        return message.ToDto();
    }

    public async Task<ChatMessageDto> AddAssistantMessageAsync(Guid conversationId, string content, int? tokensUsed, CancellationToken ct = default)
    {
        var conversation = await conversationRepository.GetByIdAsync(conversationId, ct)
            ?? throw new InvalidOperationException("Conversation not found.");

        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderType = MessageSender.Assistant,
            Content = content,
            SentAt = DateTime.UtcNow,
            TokensUsed = tokensUsed
        };

        await messageRepository.AddAsync(message, ct);

        conversation.MessageCount++;
        conversation.LastMessageAt = message.SentAt;
        await conversationRepository.UpdateAsync(conversation, ct);

        await publishEndpoint.Publish(new ChatMessageSentEvent(
            message.Id,
            conversationId,
            MessageSender.Assistant.ToString(),
            DateTime.UtcNow), ct);

        return message.ToDto();
    }

    public async Task<ChatStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var total = await conversationRepository.GetCountAsync(ct);
        var active = await conversationRepository.GetCountByStatusAsync(ConversationStatus.Active, ct);

        var allConversations = await conversationRepository.GetAllAsync(0, int.MaxValue, ct);
        var avgMessages = total > 0 ? allConversations.Average(c => c.MessageCount) : 0;
        var today = allConversations.Count(c => c.CreatedAt.Date == DateTime.UtcNow.Date);

        return new ChatStatsDto(total, active, Math.Round(avgMessages, 1), today);
    }
}
