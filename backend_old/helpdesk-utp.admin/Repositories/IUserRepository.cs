using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
}
