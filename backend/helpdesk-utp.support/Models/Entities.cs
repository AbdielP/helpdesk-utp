using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_utp.support.Models;

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

    public ICollection<Ticket> CreatedTickets { get; set; } = [];
    public ICollection<Ticket> AssignedTickets { get; set; } = [];
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
    public User? CreatedByUser { get; set; }

    [Column("assigned_to")]
    [JsonPropertyName("assigned_to")]
    public Guid? AssignedTo { get; set; }
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
    public Ticket? Ticket { get; set; }

    [Column("user_id")]
    [JsonPropertyName("user_id")]
    public Guid UserId { get; set; }
    public User? User { get; set; }

    [Column("action")]
    public required string Action { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
