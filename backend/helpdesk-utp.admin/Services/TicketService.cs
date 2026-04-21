using helpdesk_utp.admin.Models;
using helpdesk_utp.admin.Repositories;

namespace helpdesk_utp.admin.Services;

public class TicketService(ITicketRepository ticketRepository) : ITicketService
{
    public Task<IEnumerable<Ticket>> GetAllTicketsAsync() => ticketRepository.GetAllTicketsAsync();

    public Task<Ticket?> GetTicketByIdAsync(Guid id) => ticketRepository.GetTicketByIdAsync(id);

    public async Task<bool> UpdateTicketStatusAsync(Guid id, string status)
    {
        var ticket = await ticketRepository.GetTicketByIdAsync(id);
        if (ticket == null) return false;
        
        await ticketRepository.UpdateTicketStatusAsync(id, status);
        return true;
    }

    public async Task<bool> AssignTicketAsync(Guid id, Guid userId)
    {
        var ticket = await ticketRepository.GetTicketByIdAsync(id);
        if (ticket == null) return false;
        
        await ticketRepository.AssignTicketAsync(id, userId);
        return true;
    }
}
