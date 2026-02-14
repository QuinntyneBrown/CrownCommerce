using CrownCommerce.Payment.Core.Entities;

namespace CrownCommerce.Payment.Core.Interfaces;

public interface IRefundRepository
{
    Task<RefundRecord> AddAsync(RefundRecord refund, CancellationToken ct = default);
    Task<IReadOnlyList<RefundRecord>> GetByPaymentIdAsync(Guid paymentId, CancellationToken ct = default);
}
