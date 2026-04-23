using helpdesk_utp.user.Models;

namespace helpdesk_utp.user.Services;

public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetTicketsAsync(Guid userId);
    Task<Ticket?> GetTicketAsync(Guid id);
    Task<Ticket> CreateNewTicketAsync(CreateTicketRequest request);
}
