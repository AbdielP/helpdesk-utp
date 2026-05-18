using System.Text.Json.Serialization;

namespace helpdesk_notifications.DTOs;

public record TicketEventRequest(
    string Type,
    [property: JsonPropertyName("ticket_id")] Guid TicketId,
    [property: JsonPropertyName("actor_user_id")] Guid? ActorUserId,
    [property: JsonPropertyName("previous_status")] string? PreviousStatus,
    [property: JsonPropertyName("new_status")] string? NewStatus
);
