using CrownCommerce.Inquiry.Core.Entities;

namespace CrownCommerce.Inquiry.Core.Interfaces;

public interface IWholesaleInquiryRepository
{
    Task<IReadOnlyList<WholesaleInquiry>> GetAllAsync(CancellationToken ct = default);
    Task<WholesaleInquiry> AddAsync(WholesaleInquiry inquiry, CancellationToken ct = default);
}
