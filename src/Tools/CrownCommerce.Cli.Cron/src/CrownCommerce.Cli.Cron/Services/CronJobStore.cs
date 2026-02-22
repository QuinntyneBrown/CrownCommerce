using System.Text.Json;
using CrownCommerce.Cli.Cron.Commands;
using Microsoft.Extensions.Configuration;

namespace CrownCommerce.Cli.Cron.Services;

public class CronJobStore : ICronJobStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly string _jobsFilePath;
    private readonly string _historyFilePath;

    public CronJobStore(IConfiguration configuration)
    {
        var basePath = configuration["Cron:StorePath"]
            ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".crowncommerce", "cron");

        Directory.CreateDirectory(basePath);

        _jobsFilePath = Path.Combine(basePath, "jobs.json");
        _historyFilePath = Path.Combine(basePath, "history.json");
    }

    public async Task<IReadOnlyList<CronJobDefinition>> LoadJobsAsync()
    {
        if (!File.Exists(_jobsFilePath))
        {
            return Array.Empty<CronJobDefinition>();
        }

        var json = await File.ReadAllTextAsync(_jobsFilePath);
        return JsonSerializer.Deserialize<List<CronJobDefinition>>(json, JsonOptions)
            ?? new List<CronJobDefinition>();
    }

    public async Task SaveJobsAsync(IReadOnlyList<CronJobDefinition> jobs)
    {
        var json = JsonSerializer.Serialize(jobs, JsonOptions);
        await File.WriteAllTextAsync(_jobsFilePath, json);
    }

    public async Task<IReadOnlyList<CronJobHistory>> LoadHistoryAsync(string? jobName = null)
    {
        if (!File.Exists(_historyFilePath))
        {
            return Array.Empty<CronJobHistory>();
        }

        var json = await File.ReadAllTextAsync(_historyFilePath);
        var history = JsonSerializer.Deserialize<List<CronJobHistory>>(json, JsonOptions)
            ?? new List<CronJobHistory>();

        if (jobName is not null)
        {
            return history.Where(h => h.JobName == jobName).ToList();
        }

        return history;
    }

    public async Task AppendHistoryAsync(CronJobHistory entry)
    {
        List<CronJobHistory> history;

        if (File.Exists(_historyFilePath))
        {
            var json = await File.ReadAllTextAsync(_historyFilePath);
            history = JsonSerializer.Deserialize<List<CronJobHistory>>(json, JsonOptions)
                ?? new List<CronJobHistory>();
        }
        else
        {
            history = new List<CronJobHistory>();
        }

        history.Add(entry);

        var updatedJson = JsonSerializer.Serialize(history, JsonOptions);
        await File.WriteAllTextAsync(_historyFilePath, updatedJson);
    }
}
