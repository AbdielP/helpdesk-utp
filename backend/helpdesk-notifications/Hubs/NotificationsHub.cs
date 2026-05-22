using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace helpdesk_notifications.Hubs;

[Authorize]
public class NotificationsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var rawUserId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) ??
                        Context.User?.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (Guid.TryParse(rawUserId, out var parsedUserId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetUserGroupName(parsedUserId));
        }

        await base.OnConnectedAsync();
    }

    public static string GetUserGroupName(Guid userId) => $"user:{userId}";
}
