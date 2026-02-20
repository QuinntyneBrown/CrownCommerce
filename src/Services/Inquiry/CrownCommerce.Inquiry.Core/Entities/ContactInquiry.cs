using CrownCommerce.Inquiry.Core.Enums;

namespace CrownCommerce.Inquiry.Core.Entities;

public sealed class ContactInquiry
{
    public Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public ContactSubject Subject { get; set; }
    public required string Message { get; set; }
    public DateTime CreatedAt { get; set; }
}
