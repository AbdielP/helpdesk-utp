using helpdesk_tickets.Entities;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_tickets.Data;

public class TicketsDbContext(DbContextOptions<TicketsDbContext> options) : DbContext(options)
{
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<TicketHistory> TicketHistories => Set<TicketHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TicketHistory>()
            .ToTable("ticket_history");
    }
}