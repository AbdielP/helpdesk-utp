using helpdesk_utp.user.Models;

namespace helpdesk_utp.user.Repositories;

public class MockTicketRepository : ITicketRepository
{
    private readonly List<Ticket> _tickets = 
    [
        new Ticket { Id = Guid.NewGuid(), Title = "Internet Down", Description = "No connection in Building A", Category = "Network", CreatedBy = Guid.NewGuid(), CreatedAt = DateTime.UtcNow },
        new Ticket { Id = Guid.NewGuid(), Title = "Printer Jam", Description = "Printer in Room 302 is jammed", Category = "Hardware", CreatedBy = Guid.NewGuid(), CreatedAt = DateTime.UtcNow }
    ];

    public async Task<IEnumerable<Ticket>> GetAllTicketsAsync() => await Task.FromResult(_tickets);

    public async Task<Ticket?> GetTicketByIdAsync(Guid id) => await Task.FromResult(_tickets.FirstOrDefault(t => t.Id == id));

    public async Task<Ticket> CreateTicketAsync(Ticket ticket)
    {
        ticket.Id = Guid.NewGuid();
        ticket.CreatedAt = DateTime.UtcNow;
        _tickets.Add(ticket);
        return await Task.FromResult(ticket);
    }
}
