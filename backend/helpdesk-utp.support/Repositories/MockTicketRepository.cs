using helpdesk_utp.support.Models;

namespace helpdesk_utp.support.Repositories;

public class MockTicketRepository : ITicketRepository
{
    private readonly List<Ticket> _tickets = new()
    {
        new Ticket
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Title = "Printer not working",
            Description = "The printer in the second floor is not responding.",
            Category = "Hardware",
            Priority = "Alta",
            Status = "Abierto",
            CreatedBy = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        },
        new Ticket
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Title = "Cannot login to portal",
            Description = "I'm getting an invalid password error even after reset.",
            Category = "Software",
            Priority = "Media",
            Status = "En proceso",
            CreatedBy = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }
    };

    public Task<IEnumerable<Ticket>> GetTicketsByAssignedToAsync(Guid userId)
    {
        return Task.FromResult<IEnumerable<Ticket>>(
            _tickets.Where(ticket => ticket.AssignedTo == userId).ToList()
        );
    }

    public Task<Ticket?> GetTicketByIdAsync(Guid id)
    {
        return Task.FromResult(_tickets.FirstOrDefault(t => t.Id == id));
    }

    public Task<bool> UpdateTicketStatusAsync(Guid id, string status)
    {
        var ticket = _tickets.FirstOrDefault(t => t.Id == id);
        if (ticket == null) return Task.FromResult(false);
        
        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;
        return Task.FromResult(true);
    }
}
