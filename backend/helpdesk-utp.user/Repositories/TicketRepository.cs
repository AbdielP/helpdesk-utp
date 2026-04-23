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

    public async Task<TicketDetailResponse?> GetTicketByIdAsync(Guid id, Guid userId)
    {
        return await dbContext.Tickets
            .AsNoTracking()
            .Where(ticket => ticket.Id == id && ticket.CreatedBy == userId)
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
            Action = "Ticket creado",
            CreatedAt = DateTime.UtcNow
        });

        if (ticket.AssignedTo is Guid assignedToUserId)
        {
            dbContext.TicketHistories.Add(new TicketHistory
            {
                Id = Guid.NewGuid(),
                TicketId = ticket.Id,
                UserId = ticket.CreatedBy,
                Action = $"Ticket asignado al tecnico {assignedToUserId}",
                CreatedAt = ticket.CreatedAt
            });
        }

        await dbContext.SaveChangesAsync();
        return ticket;
    }
}
