using CrownCommerce.Catalog.Application.Dtos;
using CrownCommerce.Catalog.Application.Mapping;
using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Enums;
using CrownCommerce.Catalog.Core.Interfaces;

namespace CrownCommerce.Catalog.Application.Services;

public sealed class CatalogService(ICatalogRepository catalogRepo, IHairOriginRepository originRepo) : ICatalogService
{
    public async Task<IReadOnlyList<HairProductDto>> GetAllProductsAsync(CancellationToken ct = default)
    {
        var products = await catalogRepo.GetAllAsync(ct);
        return products.Select(p => p.ToDto()).ToList();
    }

    public async Task<HairProductDto?> GetProductByIdAsync(Guid id, CancellationToken ct = default)
    {
        var product = await catalogRepo.GetByIdAsync(id, ct);
        return product?.ToDto();
    }

    public async Task<IReadOnlyList<HairProductDto>> GetProductsByOriginAsync(Guid originId, CancellationToken ct = default)
    {
        var products = await catalogRepo.GetByOriginIdAsync(originId, ct);
        return products.Select(p => p.ToDto()).ToList();
    }

    public async Task<HairProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken ct = default)
    {
        var product = new HairProduct
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            OriginId = dto.OriginId,
            Texture = Enum.Parse<HairTexture>(dto.Texture, ignoreCase: true),
            Type = Enum.Parse<HairType>(dto.Type, ignoreCase: true),
            LengthInches = dto.LengthInches,
            Price = dto.Price,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
        };

        var created = await catalogRepo.AddAsync(product, ct);
        return created.ToDto();
    }

    public async Task<HairProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken ct = default)
    {
        var product = new HairProduct
        {
            Id = id,
            Name = dto.Name,
            OriginId = dto.OriginId,
            Texture = Enum.Parse<HairTexture>(dto.Texture, ignoreCase: true),
            Type = Enum.Parse<HairType>(dto.Type, ignoreCase: true),
            LengthInches = dto.LengthInches,
            Price = dto.Price,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
        };

        var updated = await catalogRepo.UpdateAsync(product, ct);
        return updated.ToDto();
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken ct = default)
    {
        await catalogRepo.DeleteAsync(id, ct);
    }

    public async Task<IReadOnlyList<HairOriginDto>> GetAllOriginsAsync(CancellationToken ct = default)
    {
        var origins = await originRepo.GetAllAsync(ct);
        return origins.Select(o => o.ToDto()).ToList();
    }

    public async Task<HairOriginDto?> GetOriginByIdAsync(Guid id, CancellationToken ct = default)
    {
        var origin = await originRepo.GetByIdAsync(id, ct);
        return origin?.ToDto();
    }

    public async Task<HairOriginDto> CreateOriginAsync(CreateOriginDto dto, CancellationToken ct = default)
    {
        var origin = new HairOrigin
        {
            Id = Guid.NewGuid(),
            Country = dto.Country,
            Region = dto.Region,
            Description = dto.Description,
        };

        var created = await originRepo.AddAsync(origin, ct);
        return created.ToDto();
    }

    public async Task<HairOriginDto> UpdateOriginAsync(Guid id, UpdateOriginDto dto, CancellationToken ct = default)
    {
        var origin = new HairOrigin
        {
            Id = id,
            Country = dto.Country,
            Region = dto.Region,
            Description = dto.Description,
        };

        var updated = await originRepo.UpdateAsync(origin, ct);
        return updated.ToDto();
    }

    public async Task DeleteOriginAsync(Guid id, CancellationToken ct = default)
    {
        await originRepo.DeleteAsync(id, ct);
    }
}
