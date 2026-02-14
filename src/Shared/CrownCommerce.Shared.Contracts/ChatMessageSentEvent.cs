namespace CrownCommerce.Shared.Contracts;

public sealed record ChatMessageSentEvent(
    Guid MessageId,
    Guid ConversationId,
    string SenderType,
    DateTime OccurredAt);
