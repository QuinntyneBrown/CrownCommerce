using System.Text.Json;
using CrownCommerce.Cli.Schedule.Commands;
using Microsoft.Extensions.Configuration;

namespace CrownCommerce.Cli.Schedule.Services;

public class ScheduleStore : IScheduleStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    private readonly string _basePath;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private bool _seeded;

    public ScheduleStore(IConfiguration configuration)
    {
        var configuredPath = configuration["Schedule:BasePath"];
        _basePath = configuredPath
            ?? Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                ".crowncommerce",
                "schedule");
    }

    private string MeetingsFilePath => Path.Combine(_basePath, "meetings.json");
    private string ChannelsFilePath => Path.Combine(_basePath, "channels.json");

    public async Task<IReadOnlyList<Meeting>> GetMeetingsAsync(bool week, string? forEmail)
    {
        await EnsureSeededAsync();

        var meetings = await ReadJsonAsync<List<Meeting>>(MeetingsFilePath) ?? [];

        if (forEmail is not null)
        {
            meetings = meetings
                .Where(m => m.Attendees.Contains(forEmail, StringComparer.OrdinalIgnoreCase))
                .ToList();
        }

        if (!week)
        {
            meetings = meetings.Where(m => m.Start.Date == DateTime.UtcNow.Date).ToList();
        }

        return meetings;
    }

    public async Task AddMeetingAsync(Meeting meeting)
    {
        await EnsureSeededAsync();
        await _lock.WaitAsync();
        try
        {
            var meetings = await ReadJsonAsync<List<Meeting>>(MeetingsFilePath) ?? [];
            meetings.Add(meeting);
            await WriteJsonAsync(MeetingsFilePath, meetings);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<IReadOnlyList<Channel>> GetChannelsAsync(string? type)
    {
        await EnsureSeededAsync();

        var channels = await ReadJsonAsync<List<Channel>>(ChannelsFilePath) ?? [];

        if (type is not null)
        {
            channels = channels
                .Where(c => c.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return channels;
    }

    public async Task<IReadOnlyList<Availability>> GetAvailabilityAsync(string date)
    {
        await EnsureSeededAsync();

        // Availability is derived from team data, not persisted separately
        return new List<Availability>
        {
            new("quinn@crowncommerce.io", "Quinn Brown", "America/Toronto", ["09:00-10:00", "13:00-15:00"]),
            new("amara@crowncommerce.io", "Amara Okafor", "Africa/Lagos", ["10:00-12:00", "14:00-16:00"]),
            new("wanjiku@crowncommerce.io", "Wanjiku Mwangi", "Africa/Lagos", ["09:00-11:00", "15:00-17:00"]),
            new("sophia@crowncommerce.io", "Sophia Chen", "America/Toronto", ["10:00-12:00", "14:00-17:00"]),
            new("james@crowncommerce.io", "James Wright", "Europe/London", ["08:00-10:00", "13:00-16:00"]),
        };
    }

    private async Task EnsureSeededAsync()
    {
        if (_seeded) return;

        await _lock.WaitAsync();
        try
        {
            if (_seeded) return;

            Directory.CreateDirectory(_basePath);

            if (!File.Exists(MeetingsFilePath))
            {
                var seedMeetings = new List<Meeting>
                {
                    new("Sprint Planning", DateTime.UtcNow.Date.AddHours(10), "1h",
                        ["quinn@crowncommerce.io", "amara@crowncommerce.io"], "Zoom"),
                    new("Product Review", DateTime.UtcNow.Date.AddHours(14), "30m",
                        ["sophia@crowncommerce.io", "james@crowncommerce.io"], "Google Meet"),
                    new("Styling Workshop", DateTime.UtcNow.Date.AddDays(1).AddHours(11), "2h",
                        ["wanjiku@crowncommerce.io", "sophia@crowncommerce.io"], "Studio A"),
                };
                await WriteJsonAsync(MeetingsFilePath, seedMeetings);
            }

            if (!File.Exists(ChannelsFilePath))
            {
                var seedChannels = new List<Channel>
                {
                    new("general", "public", 5),
                    new("product-launches", "public", 4),
                    new("engineering", "public", 3),
                    new("hair-styling-tips", "public", 3),
                    new("random", "public", 5),
                    new("marketing", "public", 2),
                    new("client-support", "public", 4),
                };
                await WriteJsonAsync(ChannelsFilePath, seedChannels);
            }

            _seeded = true;
        }
        finally
        {
            _lock.Release();
        }
    }

    private static async Task<T?> ReadJsonAsync<T>(string filePath)
    {
        if (!File.Exists(filePath)) return default;
        var json = await File.ReadAllTextAsync(filePath);
        return JsonSerializer.Deserialize<T>(json, JsonOptions);
    }

    private static async Task WriteJsonAsync<T>(string filePath, T data)
    {
        var json = JsonSerializer.Serialize(data, JsonOptions);
        await File.WriteAllTextAsync(filePath, json);
    }
}
