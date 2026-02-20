namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record CreateProductReviewDto(
    string CustomerName,
    int Rating,
    string Content);
