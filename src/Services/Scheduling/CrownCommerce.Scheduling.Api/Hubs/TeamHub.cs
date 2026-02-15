using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CrownCommerce.Scheduling.Api.Hubs;

[Authorize]
public class TeamHub : Hub
{
    public async Task JoinChannel(string channelId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId);
    }

    public async Task LeaveChannel(string channelId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId);
    }

    public async Task SendMessage(string channelId, string senderEmployeeId, string senderName, string senderInitials, string content)
    {
        await Clients.Group(channelId).SendAsync("ReceiveMessage", new
        {
            channelId,
            senderEmployeeId,
            senderName,
            senderInitials,
            content,
            sentAt = DateTime.UtcNow.ToString("o")
        });
    }

    public async Task StartTyping(string channelId, string employeeId, string employeeName)
    {
        await Clients.OthersInGroup(channelId).SendAsync("UserTyping", new
        {
            channelId,
            employeeId,
            employeeName,
            isTyping = true
        });
    }

    public async Task StopTyping(string channelId, string employeeId, string employeeName)
    {
        await Clients.OthersInGroup(channelId).SendAsync("UserTyping", new
        {
            channelId,
            employeeId,
            employeeName,
            isTyping = false
        });
    }

    public async Task UpdatePresence(string employeeId, string presence)
    {
        await Clients.Others.SendAsync("PresenceUpdated", new
        {
            employeeId,
            presence
        });
    }
}
