namespace CrownCommerce.Shared.Contracts;

public sealed record ChatConversationStartedEvent(
    Guid ConversationId,
    string? VisitorName,
    string FirstMessage,
    DateTime OccurredAt);
