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

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.CreatedByUser)
            .WithMany(u => u.CreatedTickets)
            .HasForeignKey(t => t.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedToUser)
            .WithMany(u => u.AssignedTickets)
            .HasForeignKey(t => t.AssignedTo)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasMany(t => t.History)
            .WithOne(h => h.Ticket)
            .HasForeignKey(h => h.TicketId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Histories)
            .WithOne(h => h.User)
            .HasForeignKey(h => h.UserId);
    }
}
