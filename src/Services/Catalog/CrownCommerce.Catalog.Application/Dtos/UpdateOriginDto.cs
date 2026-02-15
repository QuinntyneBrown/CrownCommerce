namespace CrownCommerce.Catalog.Application.Dtos;

public sealed record UpdateOriginDto(
    string Country,
    string Region,
    string Description);
