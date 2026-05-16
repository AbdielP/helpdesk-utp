using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace helpdesk_tickets.Entities;

[Table("tickets")]
public class Ticket
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("title")]
    public required string Title { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("category")]
    public string? Category { get; set; }

    [Column("priority")]
    public string? Priority { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Abierto";

    [Column("created_by")]
    [JsonPropertyName("created_by")]
    public Guid CreatedBy { get; set; }

    [Column("assigned_to")]
    [JsonPropertyName("assigned_to")]
    public Guid? AssignedTo { get; set; }

    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; }
}