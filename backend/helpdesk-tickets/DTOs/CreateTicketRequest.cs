namespace helpdesk_tickets.DTOs;

/// <summary>
/// Datos que captura el formulario de creacion de tickets.
/// </summary>
public record CreateTicketRequest(
    string Title,
    string Description,
    string Category,
    string Priority
);
