using System.Text.Json.Serialization;

namespace helpdesk_tickets.DTOs;

/// <summary>
/// Evento que Tickets API envia a Notifications API cuando un cambio debe avisarse.
/// </summary>
public record NotificationTicketEventRequest(
    string Type,
    [property: JsonPropertyName("ticket_id")] Guid TicketId,
    [property: JsonPropertyName("actor_user_id")] Guid? ActorUserId,
    [property: JsonPropertyName("previous_status")] string? PreviousStatus,
    [property: JsonPropertyName("new_status")] string? NewStatus
);
