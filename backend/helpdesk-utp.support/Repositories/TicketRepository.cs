using helpdesk_utp.support.Data;
using helpdesk_utp.support.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.support.Repositories;

public class TicketRepository(SupportDbContext dbContext) : ITicketRepository
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
            .FirstOrDefaultAsync(ticket => ticket.Id == id);
    }

    public async Task<bool> UpdateTicketStatusAsync(Guid id, string status)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return false;
        }

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();
        return true;
    }
}
