using helpdesk_utp.auth.Models;
using helpdesk_utp.auth.Repositories;
using Microsoft.Extensions.Logging;

namespace helpdesk_utp.auth.Services;

public class AuthService(IAuthRepository authRepository, ILogger<AuthService> logger) : IAuthService
{
    public LoginResponse? Login(LoginRequest request)
    {
        logger.LogInformation("Processing login for {Username}", request.Username);

        // Simple mock logic: accept any non-empty username/password
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
        {
            logger.LogWarning("Login failed: Username or password was empty");
            return null;
        }

        var token = authRepository.GetFakeJwtToken(request.Username);
        logger.LogInformation("Successfully generated token for {Username}", request.Username);
        return new LoginResponse(token);
    }

    public void Logout()
    {
        logger.LogInformation("Processing logout");
        // Logout logic (could be clearing a cookie or token in a real app)
    }
}
