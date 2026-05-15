using helpdesk_users.Entities;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_users.Data;

public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();
    }
}
