using CrownCommerce.Inquiry.Core.Entities;

namespace CrownCommerce.Inquiry.Core.Interfaces;

public interface IContactInquiryRepository
{
    Task<IReadOnlyList<ContactInquiry>> GetAllAsync(CancellationToken ct = default);
    Task<ContactInquiry> AddAsync(ContactInquiry inquiry, CancellationToken ct = default);
}
