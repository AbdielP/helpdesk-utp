using helpdesk_utp.auth.Models;
using helpdesk_utp.auth.Repositories;
using Microsoft.Extensions.Logging;
using System.Text;

namespace helpdesk_utp.auth.Services;

public class AuthService(IAuthRepository authRepository, ILogger<AuthService> logger) : IAuthService
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        logger.LogInformation("Processing login for {Email}", request.Email);

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            logger.LogWarning("Login failed: Email or password was empty");
            return null;
        }

        var user = await authRepository.GetUserByEmailAsync(request.Email);
        if (user is null || user.Password != request.Password)
        {
            logger.LogWarning("Login failed for {Email}", request.Email);
            return null;
        }

        var tokenPayload = $"{user.Id}:{user.Email}:{DateTime.UtcNow:O}";
        var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenPayload));

        logger.LogInformation("Login succeeded for {Email}", request.Email);
        return new LoginResponse(token, new AuthenticatedUser(user.Id, user.Email, user.Role));
    }

    public Task LogoutAsync()
    {
        logger.LogInformation("Processing logout");
        return Task.CompletedTask;
    }
}
