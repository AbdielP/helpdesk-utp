using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_tickets.Entities;

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
    public DateTime CreatedAt { get; set; }
}
