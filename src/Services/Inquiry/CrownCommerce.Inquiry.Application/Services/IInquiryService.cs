using CrownCommerce.Inquiry.Application.Dtos;

namespace CrownCommerce.Inquiry.Application.Services;

public interface IInquiryService
{
    Task<InquiryDto> CreateAsync(CreateInquiryDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<InquiryDto>> GetAllAsync(CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task<WholesaleInquiryDto> CreateWholesaleInquiryAsync(CreateWholesaleInquiryDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<WholesaleInquiryDto>> GetAllWholesaleInquiriesAsync(CancellationToken ct = default);
    Task<ContactInquiryDto> CreateContactInquiryAsync(CreateContactInquiryDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<ContactInquiryDto>> GetAllContactInquiriesAsync(CancellationToken ct = default);
    Task<AmbassadorApplicationDto> CreateAmbassadorApplicationAsync(CreateAmbassadorApplicationDto dto, CancellationToken ct = default);
    Task<AmbassadorApplicationDto?> GetAmbassadorApplicationByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<AmbassadorApplicationDto>> GetAllAmbassadorApplicationsAsync(CancellationToken ct = default);
}
