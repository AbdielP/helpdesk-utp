using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Services;

public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetAllTicketsAsync();
    Task<TicketDetailResponse?> GetTicketByIdAsync(Guid id);
    Task<bool> UpdateTicketStatusAsync(Guid id, string status, Guid actorUserId);
    Task<bool> AssignTicketAsync(Guid id, Guid assigneeUserId, Guid actorUserId);
}
