namespace CrownCommerce.Cli.Gen.Services;

public interface IFileSystem
{
    Task WriteFileAsync(string path, string content);
    Task CreateDirectoryAsync(string path);
    bool FileExists(string path);
    bool DirectoryExists(string path);
}
