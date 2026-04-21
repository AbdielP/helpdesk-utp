using helpdesk_utp.admin.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.admin.Data;

public class AdminDbContext(DbContextOptions<AdminDbContext> options) : DbContext(options)
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
