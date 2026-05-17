using System.Text.Json.Serialization;

namespace helpdesk_tickets.DTOs;

public record TicketDetailResponse(
    Guid Id,
    string Title,
    string? Description,
    string? Category,
    string? Priority,
    string Status,
    [property: JsonPropertyName("created_by")] Guid CreatedBy,
    [property: JsonPropertyName("assigned_to")] Guid? AssignedTo,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("updated_at")] DateTime UpdatedAt,
    [property: JsonPropertyName("created_by_user")] TicketUserSummary? CreatedByUser,
    [property: JsonPropertyName("assigned_to_user")] TicketUserSummary? AssignedToUser,
    List<TicketHistoryResponse> History
);
