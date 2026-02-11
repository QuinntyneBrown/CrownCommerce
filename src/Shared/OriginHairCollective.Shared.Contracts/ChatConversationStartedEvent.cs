namespace OriginHairCollective.Shared.Contracts;

public sealed record ChatConversationStartedEvent(
    Guid ConversationId,
    string? VisitorName,
    string FirstMessage,
    DateTime OccurredAt);
