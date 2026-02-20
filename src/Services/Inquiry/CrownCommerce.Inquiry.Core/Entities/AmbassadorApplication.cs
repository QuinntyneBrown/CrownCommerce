using CrownCommerce.Inquiry.Core.Enums;

namespace CrownCommerce.Inquiry.Core.Entities;

public sealed class AmbassadorApplication
{
    public Guid Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public required string InstagramHandle { get; set; }
    public string? TikTokHandle { get; set; }
    public string? YouTubeChannel { get; set; }
    public int FollowerCount { get; set; }
    public required string WhyJoin { get; set; }
    public AmbassadorApplicationStatus Status { get; set; } = AmbassadorApplicationStatus.Pending;
    public DateTime CreatedAt { get; set; }
}
