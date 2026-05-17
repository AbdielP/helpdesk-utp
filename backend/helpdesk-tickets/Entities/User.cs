using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_tickets.Entities;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("email")]
    public required string Email { get; set; }

    [Column("role")]
    public required string Role { get; set; }

    [JsonIgnore]
    public ICollection<Ticket> CreatedTickets { get; set; } = [];

    [JsonIgnore]
    public ICollection<Ticket> AssignedTickets { get; set; } = [];

    [JsonIgnore]
    public ICollection<TicketHistory> Histories { get; set; } = [];
}
