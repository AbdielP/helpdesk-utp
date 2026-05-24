using System.Text.Json.Serialization;

namespace helpdesk_tickets.DTOs;

/// <summary>
/// Vista resumida de un ticket para listados y tableros.
/// </summary>
public record TicketResponse(
    Guid Id,
    string Title,
    string? Description,
    string? Category,
    string? Priority,
    string Status,
    [property: JsonPropertyName("created_by")] Guid CreatedBy,
    [property: JsonPropertyName("assigned_to")] Guid? AssignedTo,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("updated_at")] DateTime UpdatedAt
);
