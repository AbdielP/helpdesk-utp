using System.Text.Json.Serialization;

namespace helpdesk_tickets.DTOs;

public record TicketHistoryResponse(
    Guid Id,
    [property: JsonPropertyName("ticket_id")] Guid TicketId,
    [property: JsonPropertyName("user_id")] Guid UserId,
    string Action,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    TicketUserSummary? User
);
