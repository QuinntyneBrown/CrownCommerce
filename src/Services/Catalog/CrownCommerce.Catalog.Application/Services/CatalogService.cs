using CrownCommerce.Catalog.Application.Dtos;
using CrownCommerce.Catalog.Application.Mapping;
using CrownCommerce.Catalog.Core.Entities;
using CrownCommerce.Catalog.Core.Enums;
using CrownCommerce.Catalog.Core.Interfaces;

namespace CrownCommerce.Catalog.Application.Services;

public sealed class CatalogService(
    ICatalogRepository catalogRepo,
    IHairOriginRepository originRepo,
    IProductReviewRepository reviewRepo,
    IBundleDealRepository bundleDealRepo) : ICatalogService
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

    public async Task<ProductDetailDto?> GetProductDetailAsync(Guid id, CancellationToken ct = default)
    {
        var product = await catalogRepo.GetByIdAsync(id, ct);
        return product?.ToDetailDto();
    }

    public async Task<IReadOnlyList<HairProductDto>> GetProductsByOriginAsync(Guid originId, CancellationToken ct = default)
    {
        var products = await catalogRepo.GetByOriginIdAsync(originId, ct);
        return products.Select(p => p.ToDto()).ToList();
    }

    public async Task<PagedResultDto<HairProductDto>> GetProductsByCategoryAsync(string category, ProductFilterDto filter, CancellationToken ct = default)
    {
        if (!Enum.TryParse<HairType>(category, ignoreCase: true, out var hairType))
            return new PagedResultDto<HairProductDto>([], 0, filter.Page, filter.PageSize);

        var (items, totalCount) = await catalogRepo.GetByTypeAsync(
            hairType, filter.Texture, filter.Size, filter.MinPrice, filter.MaxPrice,
            filter.Search, filter.SortBy, filter.SortDirection, filter.Page, filter.PageSize, ct);

        return new PagedResultDto<HairProductDto>(
            items.Select(p => p.ToDto()).ToList(), totalCount, filter.Page, filter.PageSize);
    }

    public async Task<PagedResultDto<HairProductDto>> SearchProductsAsync(ProductFilterDto filter, CancellationToken ct = default)
    {
        HairType? type = null;
        if (!string.IsNullOrWhiteSpace(filter.Search) && Enum.TryParse<HairType>(filter.Search, ignoreCase: true, out var parsed))
            type = parsed;

        var (items, totalCount) = await catalogRepo.SearchAsync(
            type, filter.Texture, filter.MinPrice, filter.MaxPrice,
            filter.Search, filter.SortBy, filter.SortDirection, filter.Page, filter.PageSize, ct);

        return new PagedResultDto<HairProductDto>(
            items.Select(p => p.ToDto()).ToList(), totalCount, filter.Page, filter.PageSize);
    }

    public async Task<PagedResultDto<ProductReviewDto>> GetProductReviewsAsync(Guid productId, int page, int pageSize, CancellationToken ct = default)
    {
        var reviews = await reviewRepo.GetByProductIdAsync(productId, page, pageSize, ct);
        var totalCount = await reviewRepo.GetCountByProductIdAsync(productId, ct);
        return new PagedResultDto<ProductReviewDto>(
            reviews.Select(r => r.ToDto()).ToList(), totalCount, page, pageSize);
    }

    public async Task<ProductReviewDto> CreateProductReviewAsync(Guid productId, CreateProductReviewDto dto, CancellationToken ct = default)
    {
        var review = new ProductReview
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            CustomerName = dto.CustomerName,
            Rating = dto.Rating,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
        };

        var created = await reviewRepo.AddAsync(review, ct);
        return created.ToDto();
    }

    public async Task<IReadOnlyList<HairProductDto>> GetRelatedProductsAsync(Guid productId, CancellationToken ct = default)
    {
        var products = await catalogRepo.GetRelatedAsync(productId, 4, ct);
        return products.Select(p => p.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<BundleDealDto>> GetBundleDealsAsync(CancellationToken ct = default)
    {
        var deals = await bundleDealRepo.GetAllAsync(ct);
        return deals.Select(d => d.ToDto()).ToList();
    }

    public async Task<BundleDealDto?> GetBundleDealByIdAsync(Guid id, CancellationToken ct = default)
    {
        var deal = await bundleDealRepo.GetByIdAsync(id, ct);
        return deal?.ToDto();
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
            CreatedAt = DateTime.UtcNow,
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
