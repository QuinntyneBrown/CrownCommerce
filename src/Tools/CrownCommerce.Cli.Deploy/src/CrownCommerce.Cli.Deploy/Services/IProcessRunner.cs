namespace CrownCommerce.Cli.Deploy.Services;

public record ProcessResult(int ExitCode, string Output, string Error);

public interface IProcessRunner
{
    Task<ProcessResult> RunAsync(string fileName, string arguments);
}
