using System.Text.Json.Serialization;

namespace helpdesk_notifications.DTOs;

public record CreateNotificationRequest(
    [property: JsonPropertyName("user_id")] Guid UserId,
    [property: JsonPropertyName("ticket_id")] Guid? TicketId,
    string Type,
    string Message
);
