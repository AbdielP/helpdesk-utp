using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_notifications.Entities;

[Table("notifications")]
public class Notification
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    [JsonPropertyName("user_id")]
    public Guid UserId { get; set; }

    [Column("ticket_id")]
    [JsonPropertyName("ticket_id")]
    public Guid? TicketId { get; set; }

    [Column("type")]
    public required string Type { get; set; }

    [Column("message")]
    public required string Message { get; set; }

    [Column("is_read")]
    [JsonPropertyName("is_read")]
    public bool IsRead { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }
}
