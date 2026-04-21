using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Repositories;

public class MockTicketRepository : ITicketRepository
{
    private static readonly List<Ticket> _tickets = 
    [
        new Ticket { Id = Guid.NewGuid(), Title = "Printer broken", Description = "The printer in room 101 is not working", Category = "Hardware", Status = "Open", CreatedAt = DateTime.UtcNow },
        new Ticket { Id = Guid.NewGuid(), Title = "Software license", Description = "Need a license for Visual Studio", Category = "Software", Status = "In Progress", CreatedAt = DateTime.UtcNow.AddDays(-1), AssignedTo = Guid.NewGuid() }
    ];

    public Task<IEnumerable<Ticket>> GetAllTicketsAsync() => Task.FromResult<IEnumerable<Ticket>>(_tickets);

    public Task<Ticket?> GetTicketByIdAsync(Guid id) => Task.FromResult(_tickets.FirstOrDefault(t => t.Id == id));

    public Task UpdateTicketStatusAsync(Guid id, string status)
    {
        var ticket = _tickets.FirstOrDefault(t => t.Id == id);
        if (ticket != null)
        {
            ticket.Status = status;
        }
        return Task.CompletedTask;
    }

    public Task AssignTicketAsync(Guid id, Guid userId)
    {
        var ticket = _tickets.FirstOrDefault(t => t.Id == id);
        if (ticket != null)
        {
            ticket.AssignedTo = userId;
        }
        return Task.CompletedTask;
    }
}
