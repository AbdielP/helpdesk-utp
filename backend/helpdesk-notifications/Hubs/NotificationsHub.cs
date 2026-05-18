using Microsoft.AspNetCore.SignalR;

namespace helpdesk_notifications.Hubs;

public class NotificationsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();

        if (Guid.TryParse(userId, out var parsedUserId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetUserGroupName(parsedUserId));
        }

        await base.OnConnectedAsync();
    }

    public static string GetUserGroupName(Guid userId) => $"user:{userId}";
}
