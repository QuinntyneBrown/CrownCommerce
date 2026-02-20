namespace CrownCommerce.Inquiry.Application.Dtos;

public sealed record CreateContactInquiryDto(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string Subject,
    string Message);
