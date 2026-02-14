using CrownCommerce.Catalog.Application.Dtos;
using CrownCommerce.Catalog.Core.Entities;

namespace CrownCommerce.Catalog.Application.Mapping;

public static class CatalogMappingExtensions
{
    public static HairProductDto ToDto(this HairProduct product) =>
        new(
            product.Id,
            product.Name,
            product.OriginId,
            product.Origin?.Country ?? string.Empty,
            product.Texture.ToString(),
            product.Type.ToString(),
            product.LengthInches,
            product.Price,
            product.Description,
            product.ImageUrl);

    public static HairOriginDto ToDto(this HairOrigin origin) =>
        new(
            origin.Id,
            origin.Country,
            origin.Region,
            origin.Description);
}
