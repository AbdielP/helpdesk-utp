using helpdesk_utp.support.Data;
using helpdesk_utp.support.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.support.Repositories;

public class TicketRepository(SupportDbContext dbContext) : ITicketRepository
{
    public async Task<IEnumerable<Ticket>> GetTicketsByAssignedToAsync(Guid userId)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .Where(ticket => ticket.AssignedTo == userId)
            .OrderByDescending(ticket => ticket.CreatedAt)
            .ToListAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(Guid id, Guid userId)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .Include(ticket => ticket.History)
            .FirstOrDefaultAsync(ticket => ticket.Id == id && ticket.AssignedTo == userId);
    }

    public async Task<bool> UpdateTicketStatusAsync(Guid id, string status, Guid actorUserId)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return false;
        }

        if (ticket.Status == status)
        {
            return true;
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
        return true;
    }
}
