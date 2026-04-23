using helpdesk_utp.admin.Data;
using helpdesk_utp.admin.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.admin.Repositories;

public class TicketRepository(AdminDbContext dbContext) : ITicketRepository
{
    public async Task<IEnumerable<Ticket>> GetAllTicketsAsync()
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .OrderByDescending(ticket => ticket.CreatedAt)
            .ToListAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(Guid id)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .Include(ticket => ticket.History)
            .FirstOrDefaultAsync(ticket => ticket.Id == id);
    }

    public async Task UpdateTicketStatusAsync(Guid id, string status, Guid actorUserId)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return;
        }

        if (ticket.Status == status)
        {
            return;
        }

        var previousStatus = ticket.Status;
        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;
        dbContext.TicketHistories.Add(new TicketHistory
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            UserId = actorUserId,
            Action = $"Estado cambiado de {previousStatus} a {status}",
            CreatedAt = ticket.UpdatedAt
        });

        await dbContext.SaveChangesAsync();
    }

    public async Task AssignTicketAsync(Guid id, Guid assigneeUserId, Guid actorUserId)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return;
        }

        if (ticket.AssignedTo == assigneeUserId)
        {
            return;
        }

        ticket.AssignedTo = assigneeUserId;
        ticket.UpdatedAt = DateTime.UtcNow;
        dbContext.TicketHistories.Add(new TicketHistory
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            UserId = actorUserId,
            Action = $"Ticket asignado al tecnico {assigneeUserId}",
            CreatedAt = ticket.UpdatedAt
        });

        await dbContext.SaveChangesAsync();
    }
}
