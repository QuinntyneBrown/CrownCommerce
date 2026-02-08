using HaceHairVault.Catalog.Application.Dtos;
using HaceHairVault.Catalog.Core.Entities;

namespace HaceHairVault.Catalog.Application.Mapping;

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
