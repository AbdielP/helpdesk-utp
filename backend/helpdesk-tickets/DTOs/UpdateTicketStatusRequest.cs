namespace helpdesk_tickets.DTOs;

/// <summary>
/// Nuevo estado elegido por soporte o administracion para un ticket.
/// </summary>
public record UpdateTicketStatusRequest(
    string Status
);
