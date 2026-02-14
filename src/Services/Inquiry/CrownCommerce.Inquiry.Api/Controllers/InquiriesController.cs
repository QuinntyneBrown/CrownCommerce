using CrownCommerce.Inquiry.Application.Dtos;
using CrownCommerce.Inquiry.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Inquiry.Api.Controllers;

[ApiController]
[Route("inquiries")]
public sealed class InquiriesController(IInquiryService inquiryService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInquiryDto dto, CancellationToken ct)
    {
        var result = await inquiryService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetAll), null, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var inquiries = await inquiryService.GetAllAsync(ct);
        return Ok(inquiries);
    }
}
