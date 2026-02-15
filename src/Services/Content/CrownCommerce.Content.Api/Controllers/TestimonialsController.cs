using CrownCommerce.Content.Application.Dtos;
using CrownCommerce.Content.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Content.Api.Controllers;

[ApiController]
[Route("testimonials")]
public sealed class TestimonialsController(IContentService contentService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var testimonials = await contentService.GetTestimonialsAsync(ct);
        return Ok(testimonials);
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateTestimonialDto dto, CancellationToken ct)
    {
        var testimonial = await contentService.SubmitTestimonialAsync(dto, ct);
        return CreatedAtAction(nameof(GetAll), null, testimonial);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTestimonialDto dto, CancellationToken ct)
    {
        var testimonial = await contentService.UpdateTestimonialAsync(id, dto, ct);
        return Ok(testimonial);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await contentService.DeleteTestimonialAsync(id, ct);
        return NoContent();
    }
}
