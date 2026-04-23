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

    public async Task<TicketDetailResponse?> GetTicketByIdAsync(Guid id, Guid userId)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .Where(ticket => ticket.Id == id && ticket.AssignedTo == userId)
            .Select(ticket => new TicketDetailResponse
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Category = ticket.Category,
                Priority = ticket.Priority,
                Status = ticket.Status,
                CreatedBy = ticket.CreatedBy,
                AssignedTo = ticket.AssignedTo,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                CreatedByUser = new TicketUserSummary
                {
                    Id = ticket.CreatedByUser!.Id,
                    Email = ticket.CreatedByUser.Email,
                    Role = ticket.CreatedByUser.Role
                },
                AssignedToUser = ticket.AssignedToUser == null
                    ? null
                    : new TicketUserSummary
                    {
                        Id = ticket.AssignedToUser.Id,
                        Email = ticket.AssignedToUser.Email,
                        Role = ticket.AssignedToUser.Role
                    },
                History = ticket.History
                    .OrderByDescending(entry => entry.CreatedAt)
                    .Select(entry => new TicketHistoryResponse
                    {
                        Id = entry.Id,
                        TicketId = entry.TicketId,
                        UserId = entry.UserId,
                        Action = entry.Action,
                        CreatedAt = entry.CreatedAt,
                        User = entry.User == null
                            ? null
                            : new TicketUserSummary
                            {
                                Id = entry.User.Id,
                                Email = entry.User.Email,
                                Role = entry.User.Role
                            }
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
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
