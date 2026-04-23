using helpdesk_utp.support.Models;
using helpdesk_utp.support.Repositories;

namespace helpdesk_utp.support.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TicketService(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public Task<IEnumerable<Ticket>> GetTicketsAsync(Guid userId)
    {
        return _ticketRepository.GetTicketsByAssignedToAsync(userId);
    }

    public Task<Ticket?> GetTicketByIdAsync(Guid id, Guid userId)
    {
        return _ticketRepository.GetTicketByIdAsync(id, userId);
    }

    public Task<bool> UpdateTicketStatusAsync(Guid id, string status)
    {
        return _ticketRepository.UpdateTicketStatusAsync(id, status);
    }
}
