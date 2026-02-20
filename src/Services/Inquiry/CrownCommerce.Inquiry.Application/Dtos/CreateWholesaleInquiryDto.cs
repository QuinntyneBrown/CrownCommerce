namespace CrownCommerce.Inquiry.Application.Dtos;

public sealed record CreateWholesaleInquiryDto(
    string CompanyName,
    string ContactName,
    string Email,
    string? Phone,
    string BusinessType,
    int EstimatedMonthlyVolume,
    string Message);
