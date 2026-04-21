using Microsoft.Extensions.Logging;

namespace helpdesk_utp.auth.Repositories;

public class MockAuthRepository(ILogger<MockAuthRepository> logger) : IAuthRepository
{
    public string GetFakeJwtToken(string username)
    {
        logger.LogInformation("Generating fake JWT token for {Username}", username);
        // Returning a fake JWT token
        return "fake-jwt-token-for-" + username;
    }
}
