using helpdesk_utp.user.Models;
using helpdesk_utp.user.Repositories;

namespace helpdesk_utp.user.Services;

public class TicketService(ITicketRepository repository, ILogger<TicketService> logger) : ITicketService
{
    public async Task<IEnumerable<Ticket>> GetTicketsAsync()
    {
        logger.LogInformation("Retrieving all tickets");
        return await repository.GetAllTicketsAsync();
    }

    public async Task<Ticket?> GetTicketAsync(Guid id)
    {
        logger.LogInformation("Retrieving ticket with ID: {Id}", id);
        return await repository.GetTicketByIdAsync(id);
    }

    public async Task<Ticket> CreateNewTicketAsync(CreateTicketRequest request)
    {
        logger.LogInformation("Creating new ticket: {Title}", request.Title);
        var ticket = new Ticket
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Priority = request.Priority,
            AssignedTo = request.AssignedTo,
            CreatedBy = request.CreatedBy
        };
        return await repository.CreateTicketAsync(ticket);
    }
}
