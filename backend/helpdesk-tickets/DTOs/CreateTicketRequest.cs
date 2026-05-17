using System.Text.Json.Serialization;

namespace helpdesk_tickets.DTOs;

public record CreateTicketRequest(
    string Title,
    string Description,
    string Category,
    string Priority,
    [property: JsonPropertyName("created_by")] Guid CreatedBy,
    [property: JsonPropertyName("assigned_to")] Guid? AssignedTo
);
