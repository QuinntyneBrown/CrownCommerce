namespace CrownCommerce.Inquiry.Application.Dtos;

public sealed record CreateAmbassadorApplicationDto(
    string FullName,
    string Email,
    string? Phone,
    string InstagramHandle,
    string? TikTokHandle,
    string? YouTubeChannel,
    int FollowerCount,
    string WhyJoin);
