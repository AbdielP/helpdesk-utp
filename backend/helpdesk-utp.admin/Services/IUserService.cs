using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
}
