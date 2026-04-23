using helpdesk_utp.user.Data;
using helpdesk_utp.user.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.user.Repositories;

public class TicketRepository(UserDbContext dbContext) : ITicketRepository
{
    public async Task<IEnumerable<Ticket>> GetTicketsByCreatedByAsync(Guid userId)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .Where(ticket => ticket.CreatedBy == userId)
            .OrderByDescending(ticket => ticket.CreatedAt)
            .ToListAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(Guid id)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(ticket => ticket.Id == id);
    }

    public async Task<Ticket> CreateTicketAsync(Ticket ticket)
    {
        ticket.Id = Guid.NewGuid();
        ticket.CreatedAt = DateTime.UtcNow;
        ticket.UpdatedAt = ticket.CreatedAt;

        dbContext.Tickets.Add(ticket);
        dbContext.TicketHistories.Add(new TicketHistory
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            UserId = ticket.CreatedBy,
            Action = "Ticket created",
            CreatedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();
        return ticket;
    }
}
