namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record CreateOriginDto(
    string Country,
    string Region,
    string Description);
