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

    public Task<IEnumerable<Ticket>> GetAllTicketsAsync()
    {
        return _ticketRepository.GetAllTicketsAsync();
    }

    public Task<Ticket?> GetTicketByIdAsync(Guid id)
    {
        return _ticketRepository.GetTicketByIdAsync(id);
    }

    public Task<bool> UpdateTicketStatusAsync(Guid id, string status)
    {
        return _ticketRepository.UpdateTicketStatusAsync(id, status);
    }
}
