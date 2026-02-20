namespace CrownCommerce.Content.Application.Dtos;

public sealed record WholesaleTierDto(
    Guid Id,
    string Name,
    int MinQuantity,
    int? MaxQuantity,
    decimal DiscountPercentage,
    string Description);
