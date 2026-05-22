namespace helpdesk_tickets.DTOs;

public record CreateTicketRequest(
    string Title,
    string Description,
    string Category,
    string Priority
);
