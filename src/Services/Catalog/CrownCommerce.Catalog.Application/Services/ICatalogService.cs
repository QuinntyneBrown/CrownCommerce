using CrownCommerce.Catalog.Application.Dtos;

namespace CrownCommerce.Catalog.Application.Services;

public interface ICatalogService
{
    Task<IReadOnlyList<HairProductDto>> GetAllProductsAsync(CancellationToken ct = default);
    Task<HairProductDto?> GetProductByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductDetailDto?> GetProductDetailAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<HairProductDto>> GetProductsByOriginAsync(Guid originId, CancellationToken ct = default);
    Task<PagedResultDto<HairProductDto>> GetProductsByCategoryAsync(string category, ProductFilterDto filter, CancellationToken ct = default);
    Task<PagedResultDto<HairProductDto>> SearchProductsAsync(ProductFilterDto filter, CancellationToken ct = default);
    Task<PagedResultDto<ProductReviewDto>> GetProductReviewsAsync(Guid productId, int page, int pageSize, CancellationToken ct = default);
    Task<ProductReviewDto> CreateProductReviewAsync(Guid productId, CreateProductReviewDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<HairProductDto>> GetRelatedProductsAsync(Guid productId, CancellationToken ct = default);
    Task<IReadOnlyList<BundleDealDto>> GetBundleDealsAsync(CancellationToken ct = default);
    Task<BundleDealDto?> GetBundleDealByIdAsync(Guid id, CancellationToken ct = default);
    Task<HairProductDto> CreateProductAsync(CreateProductDto dto, CancellationToken ct = default);
    Task<HairProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto, CancellationToken ct = default);
    Task DeleteProductAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<HairOriginDto>> GetAllOriginsAsync(CancellationToken ct = default);
    Task<HairOriginDto?> GetOriginByIdAsync(Guid id, CancellationToken ct = default);
    Task<HairOriginDto> CreateOriginAsync(CreateOriginDto dto, CancellationToken ct = default);
    Task<HairOriginDto> UpdateOriginAsync(Guid id, UpdateOriginDto dto, CancellationToken ct = default);
    Task DeleteOriginAsync(Guid id, CancellationToken ct = default);
}
