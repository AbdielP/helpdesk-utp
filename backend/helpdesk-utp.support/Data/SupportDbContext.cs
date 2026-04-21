using helpdesk_utp.support.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.support.Data;

public class SupportDbContext(DbContextOptions<SupportDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<TicketHistory> TicketHistories => Set<TicketHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Ticket 1:1 TicketHistory relationship
        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.History)
            .WithOne(h => h.Ticket)
            .HasForeignKey<TicketHistory>(h => h.TicketId);

        // User 1:N Ticket relationship
        modelBuilder.Entity<User>()
            .HasMany(u => u.Tickets)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.CreatedBy);

        // User 1:N TicketHistory relationship
        modelBuilder.Entity<User>()
            .HasMany(u => u.Histories)
            .WithOne(h => h.User)
            .HasForeignKey(h => h.UserId);
    }
}
