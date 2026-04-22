using helpdesk_utp.auth.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.auth.Data;

public class AuthDbContext(DbContextOptions<AuthDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
}
