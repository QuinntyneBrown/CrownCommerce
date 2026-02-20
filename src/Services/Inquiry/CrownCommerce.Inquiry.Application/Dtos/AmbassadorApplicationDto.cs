namespace CrownCommerce.Inquiry.Application.Dtos;

public sealed record AmbassadorApplicationDto(
    Guid Id,
    string FullName,
    string Email,
    string? Phone,
    string InstagramHandle,
    string? TikTokHandle,
    string? YouTubeChannel,
    int FollowerCount,
    string WhyJoin,
    string Status,
    DateTime CreatedAt);
