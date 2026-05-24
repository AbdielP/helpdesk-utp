namespace helpdesk_tickets.DTOs;

/// <summary>
/// Usuario de soporte que recibira la responsabilidad del ticket.
/// </summary>
public record AssignTicketRequest(
    Guid AssigneeUserId
);
