using helpdesk_utp.admin.Models;
using helpdesk_utp.admin.Repositories;

namespace helpdesk_utp.admin.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public Task<IEnumerable<User>> GetUsersByRoleAsync(string role) => 
        userRepository.GetUsersByRoleAsync(role);
}
