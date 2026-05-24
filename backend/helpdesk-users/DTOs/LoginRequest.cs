namespace helpdesk_users.DTOs;

/// <summary>
/// Credenciales enviadas por el usuario para abrir una sesion.
/// </summary>
public record LoginRequest(
    string Email,
    string Password
);
