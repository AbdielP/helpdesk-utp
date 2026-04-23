using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Repositories;

public class MockTicketRepository : ITicketRepository
{
    private static readonly List<Ticket> _tickets = 
    [
        new Ticket { Id = Guid.NewGuid(), Title = "Printer broken", Description = "The printer in room 101 is not working", Category = "Hardware", Priority = "Media", Status = "Abierto", CreatedBy = Guid.NewGuid(), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
        new Ticket { Id = Guid.NewGuid(), Title = "Software license", Description = "Need a license for Visual Studio", Category = "Software", Priority = "Alta", Status = "En proceso", CreatedBy = Guid.NewGuid(), CreatedAt = DateTime.UtcNow.AddDays(-1), UpdatedAt = DateTime.UtcNow.AddDays(-1), AssignedTo = Guid.NewGuid() }
    ];

    public Task<IEnumerable<Ticket>> GetAllTicketsAsync() => Task.FromResult<IEnumerable<Ticket>>(_tickets);

    public Task<Ticket?> GetTicketByIdAsync(Guid id) => Task.FromResult(_tickets.FirstOrDefault(t => t.Id == id));

    public Task UpdateTicketStatusAsync(Guid id, string status, Guid actorUserId)
    {
        var ticket = _tickets.FirstOrDefault(t => t.Id == id);
        if (ticket != null)
        {
            ticket.Status = status;
            ticket.UpdatedAt = DateTime.UtcNow;
        }
        return Task.CompletedTask;
    }

    public Task AssignTicketAsync(Guid id, Guid assigneeUserId, Guid actorUserId)
    {
        var ticket = _tickets.FirstOrDefault(t => t.Id == id);
        if (ticket != null)
        {
            ticket.AssignedTo = assigneeUserId;
            ticket.UpdatedAt = DateTime.UtcNow;
        }
        return Task.CompletedTask;
    }
}
