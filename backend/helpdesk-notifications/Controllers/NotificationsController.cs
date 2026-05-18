using helpdesk_notifications.Data;
using helpdesk_notifications.DTOs;
using helpdesk_notifications.Entities;
using helpdesk_notifications.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_notifications.Controllers;

[ApiController]
[Route("notifications")]
public class NotificationsController(
    NotificationsDbContext dbContext,
    IHubContext<NotificationsHub> hubContext) : ControllerBase
{
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<List<Notification>>> GetUserNotifications(Guid userId)
    {
        var notifications = await dbContext.Notifications
            .AsNoTracking()
            .Where(notification => notification.UserId == userId)
            .OrderByDescending(notification => notification.CreatedAt)
            .Take(20)
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpGet("user/{userId:guid}/unread-count")]
    public async Task<ActionResult<object>> GetUnreadCount(Guid userId)
    {
        var count = await dbContext.Notifications
            .AsNoTracking()
            .CountAsync(notification => notification.UserId == userId && !notification.IsRead);

        return Ok(new { count });
    }

    [HttpPost]
    public async Task<ActionResult<Notification>> CreateNotification(CreateNotificationRequest request)
    {
        if (request.UserId == Guid.Empty)
        {
            return BadRequest("user_id is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Type) || string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest("type and message are required.");
        }

        var userExists = await dbContext.Users
            .AsNoTracking()
            .AnyAsync(user => user.Id == request.UserId);

        if (!userExists)
        {
            return BadRequest("user_id must reference an existing user.");
        }

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            TicketId = request.TicketId,
            Type = request.Type.Trim(),
            Message = request.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync();
        await SendNotificationAsync(notification);

        return Created($"/notifications/{notification.Id}", notification);
    }

    [HttpPost("events/ticket")]
    public async Task<IActionResult> CreateFromTicketEvent(TicketEventRequest request)
    {
        if (request.TicketId == Guid.Empty)
        {
            return BadRequest("ticket_id is required.");
        }

        var ticket = await dbContext.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(existing => existing.Id == request.TicketId);

        if (ticket is null)
        {
            return NotFound("ticket not found.");
        }

        var normalizedType = request.Type.Trim().ToLower();
        var notifications = normalizedType switch
        {
            "ticket.created" => await BuildTicketCreatedNotificationsAsync(ticket),
            "ticket.assigned" => BuildTicketAssignedNotifications(ticket),
            "ticket.closed" => BuildTicketClosedNotifications(ticket),
            "ticket.status_changed" => BuildTicketStatusChangedNotifications(ticket, request.PreviousStatus, request.NewStatus),
            _ => null
        };

        if (notifications is null)
        {
            return BadRequest("type must be ticket.created, ticket.assigned, ticket.closed, or ticket.status_changed.");
        }

        if (notifications.Count == 0)
        {
            return NoContent();
        }

        dbContext.Notifications.AddRange(notifications);
        await dbContext.SaveChangesAsync();

        foreach (var notification in notifications)
        {
            await SendNotificationAsync(notification);
        }

        return Ok(notifications);
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var notification = await dbContext.Notifications.FirstOrDefaultAsync(existing => existing.Id == id);
        if (notification is null)
        {
            return NotFound();
        }

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            await dbContext.SaveChangesAsync();
        }

        await SendUnreadCountAsync(notification.UserId);
        return NoContent();
    }

    [HttpPatch("user/{userId:guid}/read-all")]
    public async Task<IActionResult> MarkAllAsRead(Guid userId)
    {
        var updatedCount = await dbContext.Notifications
            .Where(notification => notification.UserId == userId && !notification.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(notification => notification.IsRead, true));

        if (updatedCount > 0)
        {
            await SendUnreadCountAsync(userId);
        }

        return NoContent();
    }

    private async Task<List<Notification>> BuildTicketCreatedNotificationsAsync(Ticket ticket)
    {
        var adminIds = await dbContext.Users
            .AsNoTracking()
            .Where(user => user.Role.ToLower() == "admin")
            .Select(user => user.Id)
            .ToListAsync();

        var notifications = new List<Notification>
        {
            CreateTicketNotification(
                ticket.CreatedBy,
                ticket.Id,
                "ticket.created",
                "Tu ticket fue creado correctamente.")
        };

        notifications.AddRange(adminIds
            .Where(adminId => adminId != ticket.CreatedBy)
            .Select(adminId => CreateTicketNotification(
                adminId,
                ticket.Id,
                "ticket.created",
                $"Se creo un nuevo ticket: {ticket.Title}.")));

        return notifications;
    }

    private static List<Notification> BuildTicketAssignedNotifications(Ticket ticket)
    {
        var notifications = new List<Notification>
        {
            CreateTicketNotification(
                ticket.CreatedBy,
                ticket.Id,
                "ticket.assigned",
                "Tu ticket fue asignado a soporte.")
        };

        if (ticket.AssignedTo is Guid assignedTo && assignedTo != ticket.CreatedBy)
        {
            notifications.Add(CreateTicketNotification(
                assignedTo,
                ticket.Id,
                "ticket.assigned",
                $"Se te asigno el ticket: {ticket.Title}."));
        }

        return notifications;
    }

    private static List<Notification> BuildTicketClosedNotifications(Ticket ticket) =>
    [
        CreateTicketNotification(
            ticket.CreatedBy,
            ticket.Id,
            "ticket.closed",
            "Tu ticket fue cerrado.")
    ];

    private static List<Notification> BuildTicketStatusChangedNotifications(
        Ticket ticket,
        string? previousStatus,
        string? newStatus)
    {
        var statusMessage = string.IsNullOrWhiteSpace(newStatus)
            ? "Tu ticket cambio de estado."
            : $"Tu ticket cambio a {newStatus.Trim()}.";

        if (!string.IsNullOrWhiteSpace(previousStatus) && !string.IsNullOrWhiteSpace(newStatus))
        {
            statusMessage = $"Tu ticket cambio de {previousStatus.Trim()} a {newStatus.Trim()}.";
        }

        return
        [
            CreateTicketNotification(
                ticket.CreatedBy,
                ticket.Id,
                "ticket.status_changed",
                statusMessage)
        ];
    }

    private static Notification CreateTicketNotification(
        Guid userId,
        Guid? ticketId,
        string type,
        string message) =>
        new()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TicketId = ticketId,
            Type = type,
            Message = message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

    private async Task SendNotificationAsync(Notification notification)
    {
        await hubContext
            .Clients
            .Group(NotificationsHub.GetUserGroupName(notification.UserId))
            .SendAsync("NotificationReceived", notification);

        await SendUnreadCountAsync(notification.UserId);
    }

    private async Task SendUnreadCountAsync(Guid userId)
    {
        var count = await dbContext.Notifications
            .AsNoTracking()
            .CountAsync(notification => notification.UserId == userId && !notification.IsRead);

        await hubContext
            .Clients
            .Group(NotificationsHub.GetUserGroupName(userId))
            .SendAsync("UnreadCountChanged", count);
    }
}
