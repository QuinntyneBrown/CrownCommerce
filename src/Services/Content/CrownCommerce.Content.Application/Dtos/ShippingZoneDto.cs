namespace CrownCommerce.Content.Application.Dtos;

public sealed record ShippingZoneDto(
    Guid Id,
    string Name,
    string Region,
    decimal StandardRate,
    string StandardDeliveryDays,
    decimal ExpressRate,
    string ExpressDeliveryDays,
    decimal FreeShippingThreshold);
