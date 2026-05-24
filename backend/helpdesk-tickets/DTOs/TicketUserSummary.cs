namespace helpdesk_tickets.DTOs;

/// <summary>
/// Datos cortos de usuario usados dentro de respuestas de tickets.
/// </summary>
public record TicketUserSummary(
    Guid Id,
    string Email,
    string Role
);
