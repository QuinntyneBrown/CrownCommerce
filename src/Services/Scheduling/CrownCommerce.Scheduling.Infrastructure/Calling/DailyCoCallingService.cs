using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using CrownCommerce.Scheduling.Core.Interfaces;

namespace CrownCommerce.Scheduling.Infrastructure.Calling;

public sealed class DailyCoCallingService : ICallingService
{
    private readonly HttpClient _http;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public DailyCoCallingService(HttpClient http)
    {
        _http = http;
    }

    public async Task<CallRoom> CreateRoomAsync(string name, CancellationToken ct = default)
    {
        var payload = new
        {
            name,
            properties = new
            {
                exp = DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds(),
                enable_chat = true,
                enable_screenshare = true,
                start_video_off = false,
                start_audio_off = false,
            }
        };

        var response = await _http.PostAsJsonAsync("rooms", payload, JsonOptions, ct);
        response.EnsureSuccessStatusCode();

        var room = await response.Content.ReadFromJsonAsync<DailyRoom>(JsonOptions, ct);
        return new CallRoom(
            room!.Name,
            room.Url,
            DateTimeOffset.FromUnixTimeSeconds(room.CreatedAt).UtcDateTime,
            room.Config?.Exp is > 0 ? DateTimeOffset.FromUnixTimeSeconds(room.Config.Exp.Value).UtcDateTime : null
        );
    }

    public async Task<CallRoom?> GetRoomAsync(string name, CancellationToken ct = default)
    {
        var response = await _http.GetAsync($"rooms/{name}", ct);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;

        response.EnsureSuccessStatusCode();
        var room = await response.Content.ReadFromJsonAsync<DailyRoom>(JsonOptions, ct);
        return new CallRoom(
            room!.Name,
            room.Url,
            DateTimeOffset.FromUnixTimeSeconds(room.CreatedAt).UtcDateTime,
            room.Config?.Exp is > 0 ? DateTimeOffset.FromUnixTimeSeconds(room.Config.Exp.Value).UtcDateTime : null
        );
    }

    public async Task DeleteRoomAsync(string name, CancellationToken ct = default)
    {
        var response = await _http.DeleteAsync($"rooms/{name}", ct);
        if (response.StatusCode != System.Net.HttpStatusCode.NotFound)
            response.EnsureSuccessStatusCode();
    }

    public async Task<string> CreateMeetingTokenAsync(string roomName, string userName, bool isOwner = false, CancellationToken ct = default)
    {
        var payload = new
        {
            properties = new
            {
                room_name = roomName,
                user_name = userName,
                is_owner = isOwner,
                exp = DateTimeOffset.UtcNow.AddHours(2).ToUnixTimeSeconds(),
            }
        };

        var response = await _http.PostAsJsonAsync("meeting-tokens", payload, JsonOptions, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<DailyTokenResponse>(JsonOptions, ct);
        return result!.Token;
    }

    private sealed record DailyRoom(string Name, string Url, long CreatedAt, DailyRoomConfig? Config);
    private sealed record DailyRoomConfig(long? Exp);
    private sealed record DailyTokenResponse(string Token);
}
