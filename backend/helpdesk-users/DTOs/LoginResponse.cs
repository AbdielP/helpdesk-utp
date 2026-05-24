namespace helpdesk_users.DTOs;

/// <summary>
/// Respuesta de login; el token viaja en cookie y aqui solo vuelve el perfil basico.
/// </summary>
public record LoginResponse(
    UserResponse User
);
