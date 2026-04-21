using helpdesk_utp.support.Models;

namespace helpdesk_utp.support.Services;

public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetAllTicketsAsync();
    Task<Ticket?> GetTicketByIdAsync(Guid id);
    Task<bool> UpdateTicketStatusAsync(Guid id, string status);
}
