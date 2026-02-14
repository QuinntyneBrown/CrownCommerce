using CrownCommerce.Payment.Core.Entities;
using CrownCommerce.Payment.Core.Interfaces;
using CrownCommerce.Payment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Payment.Infrastructure.Repositories;

public sealed class RefundRepository(PaymentDbContext context) : IRefundRepository
{
    public async Task<RefundRecord> AddAsync(RefundRecord refund, CancellationToken ct = default)
    {
        context.Refunds.Add(refund);
        await context.SaveChangesAsync(ct);
        return refund;
    }

    public async Task<IReadOnlyList<RefundRecord>> GetByPaymentIdAsync(Guid paymentId, CancellationToken ct = default)
    {
        return await context.Refunds
            .AsNoTracking()
            .Where(r => r.PaymentId == paymentId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(ct);
    }
}
