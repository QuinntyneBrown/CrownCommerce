namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record ProductReviewDto(
    Guid Id,
    Guid ProductId,
    string CustomerName,
    int Rating,
    string Content,
    DateTime CreatedAt);
