namespace CrownCommerce.Content.Application.Dtos;

public sealed record UpdateTestimonialDto(
    string CustomerName,
    string? CustomerLocation,
    string Content,
    int Rating,
    string? ImageUrl);
