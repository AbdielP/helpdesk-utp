using helpdesk_utp.admin.Data;
using helpdesk_utp.admin.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.admin.Repositories;

public class UserRepository(AdminDbContext dbContext) : IUserRepository
{
    public async Task<IEnumerable<User>> GetUsersByRoleAsync(string role)
    {
        return await dbContext.Users
            .AsNoTracking()
            .Where(user => user.Role.ToLower() == role.ToLower())
            .OrderBy(user => user.Email)
            .ToListAsync();
    }
}
