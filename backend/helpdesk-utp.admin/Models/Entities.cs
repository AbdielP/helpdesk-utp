using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace helpdesk_utp.admin.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Ticket> Tickets { get; set; } = [];
    public ICollection<TicketHistory> Histories { get; set; } = [];
}

public class Ticket
{
    [Key]
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    
    [ForeignKey("User")]
    public Guid CreatedBy { get; set; }
    public User? User { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Open";
    public Guid? AssignedTo { get; set; }

    // Navigation property for 1-to-1 relationship with history
    public TicketHistory? History { get; set; }
}

public class TicketHistory
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("Ticket")]
    public Guid TicketId { get; set; }
    public Ticket? Ticket { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    public required string Action { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
