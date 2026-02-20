namespace CrownCommerce.Inquiry.Application.Dtos;

public sealed record WholesaleInquiryDto(
    Guid Id,
    string CompanyName,
    string ContactName,
    string Email,
    string? Phone,
    string BusinessType,
    int EstimatedMonthlyVolume,
    string Message,
    string Status,
    DateTime CreatedAt);
