using helpdesk_utp.user.Models;

namespace helpdesk_utp.user.Repositories;

public class MockTicketRepository : ITicketRepository
{
    private readonly List<Ticket> _tickets = 
    [
        new Ticket { Id = Guid.NewGuid(), Title = "Internet Down", Description = "No connection in Building A", Category = "Network", Priority = "Alta", Status = "Abierto", CreatedBy = Guid.NewGuid(), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
        new Ticket { Id = Guid.NewGuid(), Title = "Printer Jam", Description = "Printer in Room 302 is jammed", Category = "Hardware", Priority = "Media", Status = "En proceso", CreatedBy = Guid.NewGuid(), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
    ];

    public async Task<IEnumerable<Ticket>> GetTicketsByCreatedByAsync(Guid userId) =>
        await Task.FromResult(_tickets.Where(ticket => ticket.CreatedBy == userId).ToList());

    public async Task<Ticket?> GetTicketByIdAsync(Guid id) => await Task.FromResult(_tickets.FirstOrDefault(t => t.Id == id));

    public async Task<Ticket> CreateTicketAsync(Ticket ticket)
    {
        ticket.Id = Guid.NewGuid();
        ticket.CreatedAt = DateTime.UtcNow;
        ticket.UpdatedAt = ticket.CreatedAt;
        _tickets.Add(ticket);
        return await Task.FromResult(ticket);
    }
}
