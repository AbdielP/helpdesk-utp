using helpdesk_utp.auth.Models;

namespace helpdesk_utp.auth.Repositories;

public interface IAuthRepository
{
    Task<User?> GetUserByEmailAsync(string email);
}

