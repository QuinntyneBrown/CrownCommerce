namespace CrownCommerce.Content.Core.Entities;

public sealed class ShippingZone
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Region { get; set; }
    public decimal StandardRate { get; set; }
    public required string StandardDeliveryDays { get; set; }
    public decimal ExpressRate { get; set; }
    public required string ExpressDeliveryDays { get; set; }
    public decimal FreeShippingThreshold { get; set; }
    public int SortOrder { get; set; }
}
