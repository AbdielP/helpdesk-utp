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
    // Probar esto en Postman con:
    // GET http://localhost:5000/tickets?role=admin
    // Luego adaptar frontedn
}