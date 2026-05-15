using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_users.Entities;

[Table("users")]
public class User {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("email")]
    public required string Email { get; set; }

    [Column("password")]
    [JsonIgnore]
    public string Password { get; set; } = string.Empty;

    [Column("role")]
    public required string Role { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
