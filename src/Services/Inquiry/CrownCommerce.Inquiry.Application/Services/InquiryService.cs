using CrownCommerce.Inquiry.Application.Dtos;
using CrownCommerce.Inquiry.Core.Entities;
using CrownCommerce.Inquiry.Core.Enums;
using CrownCommerce.Inquiry.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;

namespace CrownCommerce.Inquiry.Application.Services;

public sealed class InquiryService(
    IInquiryRepository repository,
    IWholesaleInquiryRepository wholesaleRepo,
    IContactInquiryRepository contactRepo,
    IAmbassadorApplicationRepository ambassadorRepo,
    IPublishEndpoint publishEndpoint) : IInquiryService
{
    public async Task<InquiryDto> CreateAsync(CreateInquiryDto dto, CancellationToken ct = default)
    {
        var inquiry = new Core.Entities.Inquiry
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Message = dto.Message,
            ProductId = dto.ProductId,
            CreatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(inquiry, ct);

        if (inquiry.ProductId.HasValue)
        {
            await publishEndpoint.Publish(new ProductInterestEvent(
                inquiry.ProductId.Value,
                $"Product {inquiry.ProductId.Value}",
                inquiry.Name,
                inquiry.Email,
                inquiry.Message,
                inquiry.CreatedAt), ct);
        }

        return ToDto(inquiry);
    }

    public async Task<IReadOnlyList<InquiryDto>> GetAllAsync(CancellationToken ct = default)
    {
        var inquiries = await repository.GetAllAsync(ct);
        return inquiries.Select(ToDto).ToList();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await repository.DeleteAsync(id, ct);
    }

    public async Task<WholesaleInquiryDto> CreateWholesaleInquiryAsync(CreateWholesaleInquiryDto dto, CancellationToken ct = default)
    {
        var inquiry = new WholesaleInquiry
        {
            Id = Guid.NewGuid(),
            CompanyName = dto.CompanyName,
            ContactName = dto.ContactName,
            Email = dto.Email,
            Phone = dto.Phone,
            BusinessType = dto.BusinessType,
            EstimatedMonthlyVolume = dto.EstimatedMonthlyVolume,
            Message = dto.Message,
            Status = WholesaleInquiryStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await wholesaleRepo.AddAsync(inquiry, ct);
        return ToDto(inquiry);
    }

    public async Task<IReadOnlyList<WholesaleInquiryDto>> GetAllWholesaleInquiriesAsync(CancellationToken ct = default)
    {
        var inquiries = await wholesaleRepo.GetAllAsync(ct);
        return inquiries.Select(ToDto).ToList();
    }

    public async Task<ContactInquiryDto> CreateContactInquiryAsync(CreateContactInquiryDto dto, CancellationToken ct = default)
    {
        var inquiry = new ContactInquiry
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Subject = Enum.TryParse<ContactSubject>(dto.Subject, ignoreCase: true, out var subject) ? subject : ContactSubject.General,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };

        await contactRepo.AddAsync(inquiry, ct);
        return ToDto(inquiry);
    }

    public async Task<IReadOnlyList<ContactInquiryDto>> GetAllContactInquiriesAsync(CancellationToken ct = default)
    {
        var inquiries = await contactRepo.GetAllAsync(ct);
        return inquiries.Select(ToDto).ToList();
    }

    public async Task<AmbassadorApplicationDto> CreateAmbassadorApplicationAsync(CreateAmbassadorApplicationDto dto, CancellationToken ct = default)
    {
        var application = new AmbassadorApplication
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            InstagramHandle = dto.InstagramHandle,
            TikTokHandle = dto.TikTokHandle,
            YouTubeChannel = dto.YouTubeChannel,
            FollowerCount = dto.FollowerCount,
            WhyJoin = dto.WhyJoin,
            Status = AmbassadorApplicationStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await ambassadorRepo.AddAsync(application, ct);
        return ToDto(application);
    }

    public async Task<AmbassadorApplicationDto?> GetAmbassadorApplicationByIdAsync(Guid id, CancellationToken ct = default)
    {
        var application = await ambassadorRepo.GetByIdAsync(id, ct);
        return application is null ? null : ToDto(application);
    }

    public async Task<IReadOnlyList<AmbassadorApplicationDto>> GetAllAmbassadorApplicationsAsync(CancellationToken ct = default)
    {
        var applications = await ambassadorRepo.GetAllAsync(ct);
        return applications.Select(ToDto).ToList();
    }

    private static InquiryDto ToDto(Core.Entities.Inquiry inquiry) =>
        new(inquiry.Id, inquiry.Name, inquiry.Email, inquiry.Phone,
            inquiry.Message, inquiry.ProductId, inquiry.CreatedAt);

    private static WholesaleInquiryDto ToDto(WholesaleInquiry inquiry) =>
        new(inquiry.Id, inquiry.CompanyName, inquiry.ContactName, inquiry.Email,
            inquiry.Phone, inquiry.BusinessType, inquiry.EstimatedMonthlyVolume,
            inquiry.Message, inquiry.Status.ToString(), inquiry.CreatedAt);

    private static ContactInquiryDto ToDto(ContactInquiry inquiry) =>
        new(inquiry.Id, inquiry.FirstName, inquiry.LastName, inquiry.Email,
            inquiry.Phone, inquiry.Subject.ToString(), inquiry.Message, inquiry.CreatedAt);

    private static AmbassadorApplicationDto ToDto(AmbassadorApplication app) =>
        new(app.Id, app.FullName, app.Email, app.Phone, app.InstagramHandle,
            app.TikTokHandle, app.YouTubeChannel, app.FollowerCount,
            app.WhyJoin, app.Status.ToString(), app.CreatedAt);
}
