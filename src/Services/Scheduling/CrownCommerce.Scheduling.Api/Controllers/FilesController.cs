using CrownCommerce.Scheduling.Application.Services;
using CrownCommerce.Scheduling.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrownCommerce.Scheduling.Api.Controllers;

[ApiController]
[Authorize]
[Route("files")]
public sealed class FilesController(ISchedulingService schedulingService, IFileStorageService fileStorage) : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] Guid employeeId, CancellationToken ct)
    {
        if (file.Length == 0) return BadRequest("Empty file");

        await using var stream = file.OpenReadStream();
        var result = await schedulingService.UploadFileAsync(stream, file.FileName, file.ContentType, file.Length, employeeId, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetFile(Guid id, CancellationToken ct)
    {
        var file = await schedulingService.GetFileAsync(id, ct);
        return file is not null ? Ok(file) : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteFile(Guid id, CancellationToken ct)
    {
        await schedulingService.DeleteFileAsync(id, ct);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("{storagePath}")]
    public async Task<IActionResult> Download(string storagePath, CancellationToken ct)
    {
        var stream = await fileStorage.GetAsync(storagePath, ct);
        if (stream is null) return NotFound();

        var contentType = "application/octet-stream";
        return File(stream, contentType, storagePath);
    }
}
