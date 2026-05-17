namespace helpdesk_tickets.DTOs;

public record TicketUserSummary(
    Guid Id,
    string Email,
    string Role
);
