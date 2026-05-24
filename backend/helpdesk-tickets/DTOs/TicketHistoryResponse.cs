using System.Text.Json.Serialization;

namespace helpdesk_tickets.DTOs;

/// <summary>
/// Entrada cronologica que explica que cambio ocurrio en un ticket y quien lo hizo.
/// </summary>
public record TicketHistoryResponse(
    Guid Id,
    [property: JsonPropertyName("ticket_id")] Guid TicketId,
    [property: JsonPropertyName("user_id")] Guid UserId,
    string Action,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    TicketUserSummary? User
);
