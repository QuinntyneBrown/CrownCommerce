using CrownCommerce.Inquiry.Application.Dtos;
using CrownCommerce.Inquiry.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Inquiry.Api.Controllers;

[ApiController]
[Route("ambassador-applications")]
public sealed class AmbassadorApplicationsController(IInquiryService inquiryService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAmbassadorApplicationDto dto, CancellationToken ct)
    {
        var result = await inquiryService.CreateAmbassadorApplicationAsync(dto, ct);
        return Created($"/ambassador-applications/{result.Id}", result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var application = await inquiryService.GetAmbassadorApplicationByIdAsync(id, ct);
        return application is null ? NotFound() : Ok(application);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var applications = await inquiryService.GetAllAmbassadorApplicationsAsync(ct);
        return Ok(applications);
    }
}
