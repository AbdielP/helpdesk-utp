using helpdesk_utp.user.Models;

namespace helpdesk_utp.user.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetAllTicketsAsync();
    Task<Ticket?> GetTicketByIdAsync(Guid id);
    Task<Ticket> CreateTicketAsync(Ticket ticket);
}
