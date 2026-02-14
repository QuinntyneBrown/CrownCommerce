using CrownCommerce.Order.Core.Entities;

namespace CrownCommerce.Order.Core.Interfaces;

public interface ICartRepository
{
    Task<IReadOnlyList<CartItem>> GetBySessionIdAsync(string sessionId, CancellationToken ct = default);
    Task<CartItem> AddAsync(CartItem item, CancellationToken ct = default);
    Task UpdateAsync(CartItem item, CancellationToken ct = default);
    Task RemoveAsync(Guid id, CancellationToken ct = default);
    Task ClearSessionAsync(string sessionId, CancellationToken ct = default);
}
