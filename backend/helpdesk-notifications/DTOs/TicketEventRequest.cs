using System.Text.Json.Serialization;

namespace helpdesk_notifications.DTOs;

/// <summary>
/// Evento recibido desde Tickets API para decidir a quienes notificar.
/// </summary>
public record TicketEventRequest(
    string Type,
    [property: JsonPropertyName("ticket_id")] Guid TicketId,
    [property: JsonPropertyName("actor_user_id")] Guid? ActorUserId,
    [property: JsonPropertyName("previous_status")] string? PreviousStatus,
    [property: JsonPropertyName("new_status")] string? NewStatus
);
