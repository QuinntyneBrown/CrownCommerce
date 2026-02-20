using CrownCommerce.Inquiry.Application.Dtos;
using CrownCommerce.Inquiry.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Inquiry.Api.Controllers;

[ApiController]
[Route("contact-inquiries")]
public sealed class ContactInquiriesController(IInquiryService inquiryService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactInquiryDto dto, CancellationToken ct)
    {
        var result = await inquiryService.CreateContactInquiryAsync(dto, ct);
        return Created($"/contact-inquiries/{result.Id}", result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var inquiries = await inquiryService.GetAllContactInquiriesAsync(ct);
        return Ok(inquiries);
    }
}
