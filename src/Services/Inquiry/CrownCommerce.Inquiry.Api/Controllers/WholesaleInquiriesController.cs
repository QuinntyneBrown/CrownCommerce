using CrownCommerce.Inquiry.Application.Dtos;
using CrownCommerce.Inquiry.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Inquiry.Api.Controllers;

[ApiController]
[Route("wholesale-inquiries")]
public sealed class WholesaleInquiriesController(IInquiryService inquiryService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWholesaleInquiryDto dto, CancellationToken ct)
    {
        var result = await inquiryService.CreateWholesaleInquiryAsync(dto, ct);
        return Created($"/wholesale-inquiries/{result.Id}", result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var inquiries = await inquiryService.GetAllWholesaleInquiriesAsync(ct);
        return Ok(inquiries);
    }
}
