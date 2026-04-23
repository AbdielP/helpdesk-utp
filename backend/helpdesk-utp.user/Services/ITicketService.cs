using helpdesk_utp.user.Models;

namespace helpdesk_utp.user.Services;

public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetTicketsAsync(Guid userId);
    Task<TicketDetailResponse?> GetTicketAsync(Guid id, Guid userId);
    Task<Ticket> CreateNewTicketAsync(CreateTicketRequest request);
}
