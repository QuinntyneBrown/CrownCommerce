using System.Text;

namespace OriginHairCollective.Chat.Application.Ai;

public sealed class SystemPromptBuilder
{
    private readonly List<ProductInfo> _products = [];
    private readonly List<OriginInfo> _origins = [];

    public void UpdateProducts(IReadOnlyList<ProductInfo> products)
    {
        _products.Clear();
        _products.AddRange(products);
    }

    public void UpdateOrigins(IReadOnlyList<OriginInfo> origins)
    {
        _origins.Clear();
        _origins.AddRange(origins);
    }

    public string Build()
    {
        var sb = new StringBuilder();

        sb.AppendLine("You are a friendly, knowledgeable assistant for Origin Hair Collective — a premium hair extension and hair product company.");
        sb.AppendLine();
        sb.AppendLine("Your role:");
        sb.AppendLine("- Help visitors learn about our products, hair textures, origins, and services.");
        sb.AppendLine("- Recommend products based on visitor needs (hair type, texture, length preferences).");
        sb.AppendLine("- Answer questions about shipping, pricing, care instructions, and company policies.");
        sb.AppendLine("- Be warm, professional, and encouraging.");
        sb.AppendLine();
        sb.AppendLine("Guidelines:");
        sb.AppendLine("- Stay on topic. If asked about unrelated subjects, politely redirect the conversation back to hair products and services.");
        sb.AppendLine("- For order-specific questions (tracking, returns, payment issues), suggest contacting our support team.");
        sb.AppendLine("- Never share internal business details, pricing strategies, or confidential information.");
        sb.AppendLine("- Keep responses concise but helpful — aim for 2-4 sentences unless more detail is needed.");
        sb.AppendLine();

        if (_products.Count > 0)
        {
            sb.AppendLine("Current Product Catalog:");
            foreach (var product in _products)
            {
                sb.AppendLine($"- {product.Name}: {product.Description} (Origin: {product.Origin}, Texture: {product.Texture}, Type: {product.Type}, Length: {product.LengthInches}\", Price: ${product.Price})");
            }
            sb.AppendLine();
        }

        if (_origins.Count > 0)
        {
            sb.AppendLine("Hair Origins:");
            foreach (var origin in _origins)
            {
                sb.AppendLine($"- {origin.Country} ({origin.Region}): {origin.Description}");
            }
            sb.AppendLine();
        }

        return sb.ToString();
    }
}

public sealed record ProductInfo(
    string Name,
    string Description,
    string Origin,
    string Texture,
    string Type,
    int LengthInches,
    decimal Price);

public sealed record OriginInfo(
    string Country,
    string Region,
    string Description);
