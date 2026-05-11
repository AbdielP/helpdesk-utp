using helpdesk_utp.auth.Models;
using Microsoft.Extensions.Logging;

namespace helpdesk_utp.auth.Repositories;

public class MockAuthRepository(ILogger<MockAuthRepository> logger) : IAuthRepository
{
    public Task<User?> GetUserByEmailAsync(string email)
    {
        logger.LogInformation("Legacy mock auth repository hit for {Email}", email);
        return Task.FromResult<User?>(null);
    }
}
