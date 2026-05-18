using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helpdesk_notifications.Entities;

[Table("tickets")]
public class Ticket
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("title")]
    public required string Title { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Abierto";

    [Column("created_by")]
    public Guid CreatedBy { get; set; }

    [Column("assigned_to")]
    public Guid? AssignedTo { get; set; }
}
