using helpdesk_utp.auth.Models;
using helpdesk_utp.auth.Repositories;

namespace helpdesk_utp.auth.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task LogoutAsync();
}

