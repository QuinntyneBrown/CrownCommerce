using CrownCommerce.Newsletter.Application.Dtos;

namespace CrownCommerce.Newsletter.Application.Services;

public interface INewsletterSubscriptionService
{
    Task<SubscribeResponseDto> SubscribeAsync(SubscribeRequestDto request, CancellationToken ct = default);
    Task ConfirmAsync(string token, CancellationToken ct = default);
    Task UnsubscribeAsync(string token, CancellationToken ct = default);
}
