using OriginHairCollective.Chat.Application.Ai;
using OriginHairCollective.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace OriginHairCollective.Chat.Application.Consumers;

public sealed class ProductCatalogChangedConsumer(
    SystemPromptBuilder systemPromptBuilder,
    ILogger<ProductCatalogChangedConsumer> logger) : IConsumer<ProductCatalogChangedEvent>
{
    public Task Consume(ConsumeContext<ProductCatalogChangedEvent> context)
    {
        var evt = context.Message;
        logger.LogInformation("Product catalog changed, refreshing AI context with {Count} products", evt.Products.Count);

        var products = evt.Products
            .Select(p => new ProductInfo(p.Name, p.Description, p.Origin, p.Texture, p.Type, p.LengthInches, p.Price))
            .ToList();

        var origins = evt.Origins
            .Select(o => new OriginInfo(o.Country, o.Region, o.Description))
            .ToList();

        systemPromptBuilder.UpdateProducts(products);
        systemPromptBuilder.UpdateOrigins(origins);

        return Task.CompletedTask;
    }
}
