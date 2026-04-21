using helpdesk_utp.admin.Models;

namespace helpdesk_utp.admin.Repositories;

public class MockUserRepository : IUserRepository
{
    private static readonly List<User> _users = 
    [
        new User { Id = Guid.NewGuid(), Email = "admin@test.com", Password = "password", Role = "admin" },
        new User { Id = Guid.NewGuid(), Email = "support1@test.com", Password = "password", Role = "support" },
        new User { Id = Guid.NewGuid(), Email = "support2@test.com", Password = "password", Role = "support" },
        new User { Id = Guid.NewGuid(), Email = "user@test.com", Password = "password", Role = "user" }
    ];

    public Task<IEnumerable<User>> GetUsersByRoleAsync(string role) => 
        Task.FromResult(_users.Where(u => u.Role.Equals(role, StringComparison.OrdinalIgnoreCase)));
}
