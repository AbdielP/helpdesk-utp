using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetAllTicketsAsync();
    Task<Ticket?> GetTicketByIdAsync(Guid id);
    Task UpdateTicketStatusAsync(Guid id, string status, Guid actorUserId);
    Task AssignTicketAsync(Guid id, Guid assigneeUserId, Guid actorUserId);
}
