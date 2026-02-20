using CrownCommerce.Inquiry.Core.Enums;

namespace CrownCommerce.Inquiry.Core.Entities;

public sealed class WholesaleInquiry
{
    public Guid Id { get; set; }
    public required string CompanyName { get; set; }
    public required string ContactName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public required string BusinessType { get; set; }
    public int EstimatedMonthlyVolume { get; set; }
    public required string Message { get; set; }
    public WholesaleInquiryStatus Status { get; set; } = WholesaleInquiryStatus.Pending;
    public DateTime CreatedAt { get; set; }
}
