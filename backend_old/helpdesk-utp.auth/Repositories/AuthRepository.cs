using helpdesk_utp.auth.Data;
using helpdesk_utp.auth.Models;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_utp.auth.Repositories;

public class AuthRepository(AuthDbContext dbContext) : IAuthRepository
{
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email == email);
    }
}
