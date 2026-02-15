using CrownCommerce.Scheduling.Core.Interfaces;

namespace CrownCommerce.Scheduling.Infrastructure.Storage;

public sealed class LocalFileStorageService : IFileStorageService
{
    private readonly string _basePath;
    private readonly string _baseUrl;

    public LocalFileStorageService(string basePath, string baseUrl)
    {
        _basePath = basePath;
        _baseUrl = baseUrl.TrimEnd('/');
        Directory.CreateDirectory(_basePath);
    }

    public async Task<string> SaveAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default)
    {
        var storageName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var filePath = Path.Combine(_basePath, storageName);

        await using var fileStream = File.Create(filePath);
        await stream.CopyToAsync(fileStream, ct);

        return storageName;
    }

    public Task<Stream?> GetAsync(string storagePath, CancellationToken ct = default)
    {
        var filePath = Path.Combine(_basePath, storagePath);
        if (!File.Exists(filePath)) return Task.FromResult<Stream?>(null);

        Stream stream = File.OpenRead(filePath);
        return Task.FromResult<Stream?>(stream);
    }

    public Task DeleteAsync(string storagePath, CancellationToken ct = default)
    {
        var filePath = Path.Combine(_basePath, storagePath);
        if (File.Exists(filePath)) File.Delete(filePath);
        return Task.CompletedTask;
    }

    public string GetPublicUrl(string storagePath)
    {
        return $"{_baseUrl}/files/{storagePath}";
    }
}
