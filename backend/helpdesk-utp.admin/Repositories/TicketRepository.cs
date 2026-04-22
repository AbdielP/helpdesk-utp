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
            .FirstOrDefaultAsync(ticket => ticket.Id == id);
    }

    public async Task UpdateTicketStatusAsync(Guid id, string status)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return;
        }

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();
    }

    public async Task AssignTicketAsync(Guid id, Guid userId)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(existing => existing.Id == id);
        if (ticket is null)
        {
            return;
        }

        ticket.AssignedTo = userId;
        ticket.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();
    }
}
