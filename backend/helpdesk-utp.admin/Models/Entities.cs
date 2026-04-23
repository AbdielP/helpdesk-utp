using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_utp.admin.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("email")]
    public required string Email { get; set; }

    [Column("password")]
    public required string Password { get; set; }

    [Column("role")]
    public required string Role { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<Ticket> CreatedTickets { get; set; } = [];
    [JsonIgnore]
    public ICollection<Ticket> AssignedTickets { get; set; } = [];
    [JsonIgnore]
    public ICollection<TicketHistory> Histories { get; set; } = [];
}

[Table("tickets")]
public class Ticket
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("title")]
    public required string Title { get; set; }

    [Column("description")]
    public required string Description { get; set; }

    [Column("category")]
    public required string Category { get; set; }

    [Column("priority")]
    public required string Priority { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Abierto";

    [Column("created_by")]
    [JsonPropertyName("created_by")]
    public Guid CreatedBy { get; set; }
    [JsonIgnore]
    public User? CreatedByUser { get; set; }

    [Column("assigned_to")]
    [JsonPropertyName("assigned_to")]
    public Guid? AssignedTo { get; set; }
    [JsonIgnore]
    public User? AssignedToUser { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TicketHistory> History { get; set; } = [];
}

[Table("ticket_history")]
public class TicketHistory
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("ticket_id")]
    [JsonPropertyName("ticket_id")]
    public Guid TicketId { get; set; }
    [JsonIgnore]
    public Ticket? Ticket { get; set; }

    [Column("user_id")]
    [JsonPropertyName("user_id")]
    public Guid UserId { get; set; }
    [JsonIgnore]
    public User? User { get; set; }

    [Column("action")]
    public required string Action { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class TicketUserSummary
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("email")]
    public required string Email { get; set; }

    [JsonPropertyName("role")]
    public required string Role { get; set; }
}

public class TicketHistoryResponse
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("ticket_id")]
    public Guid TicketId { get; set; }

    [JsonPropertyName("user_id")]
    public Guid UserId { get; set; }

    [JsonPropertyName("action")]
    public required string Action { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("user")]
    public TicketUserSummary? User { get; set; }
}

public class TicketDetailResponse
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public required string Title { get; set; }

    [JsonPropertyName("description")]
    public required string Description { get; set; }

    [JsonPropertyName("category")]
    public required string Category { get; set; }

    [JsonPropertyName("priority")]
    public required string Priority { get; set; }

    [JsonPropertyName("status")]
    public required string Status { get; set; }

    [JsonPropertyName("created_by")]
    public Guid CreatedBy { get; set; }

    [JsonPropertyName("assigned_to")]
    public Guid? AssignedTo { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("created_by_user")]
    public TicketUserSummary? CreatedByUser { get; set; }

    [JsonPropertyName("assigned_to_user")]
    public TicketUserSummary? AssignedToUser { get; set; }

    [JsonPropertyName("history")]
    public List<TicketHistoryResponse> History { get; set; } = [];
}
