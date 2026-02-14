namespace CrownCommerce.Shared.Contracts;

public sealed record SubscriberUnsubscribedEvent(
    Guid SubscriberId,
    string Email,
    DateTime OccurredAt);
