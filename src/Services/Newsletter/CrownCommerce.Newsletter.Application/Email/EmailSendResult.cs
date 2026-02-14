namespace CrownCommerce.Newsletter.Application.Email;

public sealed record EmailSendResult(
    string Recipient,
    bool Success,
    string? ExternalMessageId,
    string? ErrorMessage);
