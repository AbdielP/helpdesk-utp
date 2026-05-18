using helpdesk_tickets.Data;
using helpdesk_tickets.DTOs;
using helpdesk_tickets.Entities;
using helpdesk_tickets.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_tickets.Controllers;

[ApiController]
[Route("tickets")]
public class TicketsController(
    TicketsDbContext dbContext,
    NotificationEventPublisher notificationEventPublisher) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TicketResponse>>> GetTickets(
        [FromQuery] string? role,
        [FromQuery] Guid? userId)
    {
        var normalizedRole = role?.Trim().ToLower();

        if (normalizedRole is not "admin" and not "support" and not "user")
        {
            return BadRequest("role must be admin, support, or user.");
        }

        if (normalizedRole is "support" or "user")
        {
            if (userId is null || userId == Guid.Empty)
            {
                return BadRequest("userId is required for support and user roles.");
            }
        }

        var query = dbContext.Tickets.AsNoTracking();

        query = normalizedRole switch
        {
            "admin" => query,
            "support" => query.Where(ticket => ticket.AssignedTo == userId),
            "user" => query.Where(ticket => ticket.CreatedBy == userId),
            _ => query
        };

        var tickets = await query
            .OrderByDescending(ticket => ticket.CreatedAt)
            .Select(ticket => new TicketResponse(
                ticket.Id,
                ticket.Title,
                ticket.Description,
                ticket.Category,
                ticket.Priority,
                ticket.Status,
                ticket.CreatedBy,
                ticket.AssignedTo,
                ticket.CreatedAt,
                ticket.UpdatedAt
            ))
            .ToListAsync();

        return Ok(tickets);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TicketDetailResponse>> GetTicketById(
        Guid id,
        [FromQuery] string? role,
        [FromQuery] Guid? userId)
    {
        var normalizedRole = role?.Trim().ToLower();

        if (normalizedRole is not "admin" and not "support" and not "user")
        {
            return BadRequest("role must be admin, support, or user.");
        }

        if (normalizedRole is "support" or "user")
        {
            if (userId is null || userId == Guid.Empty)
            {
                return BadRequest("userId is required for support and user roles.");
            }
        }

        var ticket = await dbContext.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(ticket => ticket.Id == id);

        if (ticket is null)
        {
            return NotFound();
        }

        var canViewTicket = normalizedRole switch
        {
            "admin" => true,
            "support" => ticket.AssignedTo == userId,
            "user" => ticket.CreatedBy == userId,
            _ => false
        };

        if (!canViewTicket)
        {
            return NotFound();
        }

        var userIds = new HashSet<Guid> { ticket.CreatedBy };
        if (ticket.AssignedTo is Guid assignedTo)
        {
            userIds.Add(assignedTo);
        }

        var history = await dbContext.TicketHistories
            .AsNoTracking()
            .Where(entry => entry.TicketId == ticket.Id)
            .OrderByDescending(entry => entry.CreatedAt)
            .ToListAsync();

        foreach (var entry in history)
        {
            userIds.Add(entry.UserId);
        }

        var users = await dbContext.Users
            .AsNoTracking()
            .Where(user => userIds.Contains(user.Id))
            .Select(user => new TicketUserSummary(user.Id, user.Email, user.Role))
            .ToDictionaryAsync(user => user.Id);

        users.TryGetValue(ticket.CreatedBy, out var createdByUser);
        TicketUserSummary? assignedToUser = null;
        if (ticket.AssignedTo is Guid assignedToId)
        {
            users.TryGetValue(assignedToId, out assignedToUser);
        }

        var historyResponse = history
            .Select(entry =>
            {
                users.TryGetValue(entry.UserId, out var historyUser);

                return new TicketHistoryResponse(
                    entry.Id,
                    entry.TicketId,
                    entry.UserId,
                    entry.Action,
                    entry.CreatedAt,
                    historyUser
                );
            })
            .ToList();

        return Ok(new TicketDetailResponse(
            ticket.Id,
            ticket.Title,
            ticket.Description,
            ticket.Category,
            ticket.Priority,
            ticket.Status,
            ticket.CreatedBy,
            ticket.AssignedTo,
            ticket.CreatedAt,
            ticket.UpdatedAt,
            createdByUser,
            assignedToUser,
            historyResponse
        ));
    }

    [HttpPost]
    public async Task<ActionResult<TicketResponse>> CreateTicket(CreateTicketRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Description) ||
            string.IsNullOrWhiteSpace(request.Category) ||
            string.IsNullOrWhiteSpace(request.Priority))
        {
            return BadRequest("title, description, category, and priority are required.");
        }

        if (request.CreatedBy == Guid.Empty)
        {
            return BadRequest("created_by is required.");
        }

        var createdByExists = await dbContext.Users
            .AsNoTracking()
            .AnyAsync(user => user.Id == request.CreatedBy);

        if (!createdByExists)
        {
            return BadRequest("created_by must reference an existing user.");
        }

        if (request.AssignedTo is Guid assignedToUserId)
        {
            var assignedToExists = await dbContext.Users
                .AsNoTracking()
                .AnyAsync(user => user.Id == assignedToUserId);

            if (!assignedToExists)
            {
                return BadRequest("assigned_to must reference an existing user.");
            }
        }

        var now = DateTime.UtcNow;
        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Category = request.Category.Trim(),
            Priority = request.Priority.Trim(),
            Status = "Abierto",
            CreatedBy = request.CreatedBy,
            AssignedTo = request.AssignedTo,
            CreatedAt = now,
            UpdatedAt = now
        };

        dbContext.Tickets.Add(ticket);
        dbContext.TicketHistories.Add(new TicketHistory
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            UserId = ticket.CreatedBy,
            Action = "Ticket creado",
            CreatedAt = now
        });

        if (ticket.AssignedTo is Guid assignedTo)
        {
            dbContext.TicketHistories.Add(new TicketHistory
            {
                Id = Guid.NewGuid(),
                TicketId = ticket.Id,
                UserId = ticket.CreatedBy,
                Action = $"Ticket asignado al tecnico {assignedTo}",
                CreatedAt = now
            });
        }

        await dbContext.SaveChangesAsync();
        await notificationEventPublisher.PublishTicketEventAsync(
            "ticket.created",
            ticket.Id,
            ticket.CreatedBy);

        if (ticket.AssignedTo is not null)
        {
            await notificationEventPublisher.PublishTicketEventAsync(
                "ticket.assigned",
                ticket.Id,
                ticket.CreatedBy);
        }

        var response = new TicketResponse(
            ticket.Id,
            ticket.Title,
            ticket.Description,
            ticket.Category,
            ticket.Priority,
            ticket.Status,
            ticket.CreatedBy,
            ticket.AssignedTo,
            ticket.CreatedAt,
            ticket.UpdatedAt
        );

        return Created($"/tickets/{ticket.Id}", response);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateTicketStatus(Guid id, UpdateTicketStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest("status is required.");
        }

        if (request.ActorUserId == Guid.Empty)
        {
            return BadRequest("actorUserId is required.");
        }

        var actorExists = await dbContext.Users
            .AsNoTracking()
            .AnyAsync(user => user.Id == request.ActorUserId);

        if (!actorExists)
        {
            return BadRequest("actorUserId must reference an existing user.");
        }

        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        var status = request.Status.Trim();
        if (ticket.Status == status)
        {
            return NoContent();
        }

        var previousStatus = ticket.Status;
        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        dbContext.TicketHistories.Add(new TicketHistory
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            UserId = request.ActorUserId,
            Action = $"Estado cambiado de {previousStatus} a {status}",
            CreatedAt = ticket.UpdatedAt
        });

        await dbContext.SaveChangesAsync();
        await notificationEventPublisher.PublishTicketEventAsync(
            status.Equals("Cerrado", StringComparison.OrdinalIgnoreCase)
                ? "ticket.closed"
                : "ticket.status_changed",
            ticket.Id,
            request.ActorUserId,
            previousStatus,
            status);

        return NoContent();
    }

    [HttpPatch("{id:guid}/assign")]
    public async Task<IActionResult> AssignTicket(Guid id, AssignTicketRequest request)
    {
        if (request.AssigneeUserId == Guid.Empty || request.ActorUserId == Guid.Empty)
        {
            return BadRequest("assigneeUserId and actorUserId are required.");
        }

        var usersExist = await dbContext.Users
            .AsNoTracking()
            .Where(user => user.Id == request.AssigneeUserId || user.Id == request.ActorUserId)
            .Select(user => user.Id)
            .ToListAsync();

        if (!usersExist.Contains(request.AssigneeUserId))
        {
            return BadRequest("assigneeUserId must reference an existing user.");
        }

        if (!usersExist.Contains(request.ActorUserId))
        {
            return BadRequest("actorUserId must reference an existing user.");
        }

        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        if (ticket.AssignedTo == request.AssigneeUserId)
        {
            return NoContent();
        }

        ticket.AssignedTo = request.AssigneeUserId;
        ticket.UpdatedAt = DateTime.UtcNow;

        dbContext.TicketHistories.Add(new TicketHistory
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            UserId = request.ActorUserId,
            Action = $"Ticket asignado al tecnico {request.AssigneeUserId}",
            CreatedAt = ticket.UpdatedAt
        });

        await dbContext.SaveChangesAsync();
        await notificationEventPublisher.PublishTicketEventAsync(
            "ticket.assigned",
            ticket.Id,
            request.ActorUserId);

        return NoContent();
    }
}
