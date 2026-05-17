using helpdesk_tickets.Data;
using helpdesk_tickets.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_tickets.Controllers;

[ApiController]
[Route("tickets")]
public class TicketsController(TicketsDbContext dbContext) : ControllerBase
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
}
