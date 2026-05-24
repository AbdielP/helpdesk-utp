using System.Text.Json.Serialization;

namespace helpdesk_notifications.DTOs;

/// <summary>
/// Notificacion directa que se guarda y se envia al usuario indicado.
/// </summary>
public record CreateNotificationRequest(
    [property: JsonPropertyName("user_id")] Guid UserId,
    [property: JsonPropertyName("ticket_id")] Guid? TicketId,
    string Type,
    string Message
);
