using helpdesk_utp.support.Models;

namespace helpdesk_utp.support.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetTicketsByAssignedToAsync(Guid userId);
    Task<Ticket?> GetTicketByIdAsync(Guid id, Guid userId);
    Task<bool> UpdateTicketStatusAsync(Guid id, string status, Guid actorUserId);
}
